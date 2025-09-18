export class UICoordinate {
  constructor(scaleX = 0, offsetX = 0, scaleY, offsetY) {
    //if ((scaleX !== undefined) && offsetX === undefined) throw new TypeError("UICoordinate accepts 0, 2, or 4 arguments of type number. 1 argument was provided.");
    //if ((scaleY !== undefined) && offsetY === undefined) throw new TypeError("UICoordinate accepts 0, 2, or 4 arguments of type number. 3 arguments were provided.");
    this.scaleX = scaleX;
    this.offsetX = scaleY !== undefined ? offsetX : 0;
    this.scaleY = scaleY !== undefined ? scaleY : offsetX;
    this.offsetY = offsetY !== undefined ? offsetY : 0;
  }
  
  static add(a, b) {
    return new UICoordinate(
      a.scaleX + b.scaleX,
      a.offsetX + b.offsetX,
      a.scaleY + b.scaleY,
      a.offsetY + b.offsetY
    );
  }
  
  static subtract(a, b) {
    return new UICoordinate(
      a.scaleX - b.scaleX,
      a.offsetX - b.offsetX,
      a.scaleY - b.scaleY,
      a.offsetY - b.offsetY
    );
  }
}

export class Position2D {
  constructor(x = 0, y = 0) {
    //if ((x !== undefined) && y === undefined) throw new TypeError("Position2D accepts 0 or 2 arguments of type number. 1 argument was provided.");
    this.x = x;
    this.y = y;
  }
  
  static add(a, b) {
    return new Position2D(
      a.x + b.x,
      a.y + b.y
    );
  }
  
  static subtract(a, b) {
    return new Position2D(
      a.x - b.x,
      a.y - b.y
    );
  }
  
  static multiply(a, b) {
    return new Position2D(
      a.x * b.x,
      a.y * b.y
    );
  }
  
  static divide(a, b) {
    return new Position2D(
      a.x / b.x,
      a.y / b.y
    );
  }
}

export class Float4 {
  constructor(a, b, c, d) {
    this.a = a ? a : 0;
    this.b = b ? b : 0;
    this.c = c ? c : 0;
    this.d = d ? d : 0;
    if (a !== undefined && b === undefined) this.d = this.c = this.b = this.a;
    if (a !== undefined && b !== undefined && c === undefined && d === undefined) {
      this.b = 0;
      this.c = b;
      this.d = 0;
    }
  }
  
  static add(a, b) {
    return new Float4(a.a + b.a, a.b + b.b, a.c + b.c, a.d + b.d);
  }
  
  static subtract(a, b) {
    return new Float4(a.a - b.a, a.b - b.b, a.c - b.c, a.d - b.d);
  }
}

window.relayout = [];

export class UIObject {
  active = false;
  absolutePosition = new Position2D();
  absoluteSize = new Position2D();
  absoluteAnchorPoint = new Position2D();
  zIndex = 0;
  clip = false;
  
  parent = null;
  children = [];
  modifiers = [];
  
  #position = new UICoordinate();
  #size = new UICoordinate();
  #anchorPoint = new UICoordinate();
  #layoutOrder = new UICoordinate();
  #visible = true;
  
  set position(value) { this.#position = value; UIObject.addToRelayout(this); }
  set size(value) { this.#size = value; UIObject.addToRelayout(this); }
  set anchorPoint(value) { this.#anchorPoint = value; UIObject.addToRelayout(this); }
  set layoutOrder(value) { this.#layoutOrder = value; UIObject.addToRelayout(this); }
  set visible(value) { this.#visible = value; UIObject.addToRelayout(this); }
  
  get position() { return this.#position; }
  get size() { return this.#size; }
  get anchorPoint() { return this.#anchorPoint; }
  get layoutOrder() { return this.#layoutOrder; }
  get visible() { return this.#visible; }
  
  appendUIObject(object) { this.children.push(object); object.parent = this; UIObject.addToRelayout(object); UIObject.addToRelayout(this); }
  appendUIModifier(UIModifier) { this.modifiers.push(UIModifier); UIModifier.parent = this; UIObject.addToRelayout(this); }
  removeUIObject(object) { const i = this.children.indexOf(object); if (i > -1) { object.parent = null; this.children.splice(i, 1); UIObject.addToRelayout(this); } }
  removeUIModifier(UIModifier) { const i = this.children.indexOf(UIModifier); if (i > -1) { UIModifier.parent = null; this.children.splice(i, 1); UIObject.addToRelayout(this); } }
  draw() {}
  
  static addToRelayout(object) {
    if (object.#visible && object.parent && !relayout.includes(object)) relayout.push(object);
  }
  
  // layout() {}
}

export class UIModifier {
  parent = null;
  
  #enabled = true;
  
  set enabled(value) { this.#enabled = value; if (this.parent && this.layout) UIObject.addToRelayout(this.parent); }
  
  get enabled() { return this.#enabled; }
  
  // drawBefore() {}
  // drawAfter() {}
  // layout() {}
}

export function layout(UIObject) {
  UIObject.absoluteSize.x = UIObject.size.scaleX * UIObject.parent.absoluteSize.x + UIObject.size.offsetX;
  UIObject.absoluteSize.y = UIObject.size.scaleY * UIObject.parent.absoluteSize.y + UIObject.size.offsetY;
  
  UIObject.absoluteAnchorPoint.x = UIObject.anchorPoint.scaleX * UIObject.absoluteSize.x - UIObject.anchorPoint.offsetX;
  UIObject.absoluteAnchorPoint.y = UIObject.anchorPoint.scaleY * UIObject.absoluteSize.y - UIObject.anchorPoint.offsetY;
  
  UIObject.absolutePosition.x = UIObject.position.scaleX * UIObject.parent.absoluteSize.x + UIObject.position.offsetX - UIObject.absoluteAnchorPoint.x + UIObject.parent.absolutePosition.x;
  UIObject.absolutePosition.y = UIObject.position.scaleY * UIObject.parent.absoluteSize.y + UIObject.position.offsetY - UIObject.absoluteAnchorPoint.y + UIObject.parent.absolutePosition.y;
  
  for (const child of UIObject.children) {
    if (child.visible) layout(child);
    if (child.layout) child.layout();
  }
  
  for (const UIModifier of UIObject.modifiers) if (UIModifier.enabled && UIModifier.layout) UIModifier.layout();
}