import * as ui from "./core.js";

export class Frame extends ui.UIObject {
  backgroundFill = "gray";
  borderRadius = new ui.Float4();
  
  draw(context) {
    context.fillStyle = this.backgroundFill;
    if (this.borderRadius.a > 0 || this.borderRadius.b > 0 || this.borderRadius.c > 0 || this.borderRadius.d > 0) {
      const min = Math.min(this.absoluteSize.x * 0.5, this.absoluteSize.y * 0.5);
      const [radiusA, radiusB, radiusC, radiusD] = [Math.min(this.borderRadius.a, min), Math.min(this.borderRadius.b, min), Math.min(this.borderRadius.c, min), Math.min(this.borderRadius.d, min)];
      
      context.beginPath();
      
      context.moveTo(this.absolutePosition.x, this.absolutePosition.y + radiusB);
      context.lineTo(this.absolutePosition.x, this.absolutePosition.y + this.absoluteSize.y - radiusD);
      context.arcTo(this.absolutePosition.x, this.absolutePosition.y + this.absoluteSize.y, this.absolutePosition.x + radiusD, this.absolutePosition.y + this.absoluteSize.y, radiusD);
      
      context.lineTo(this.absolutePosition.x + this.absoluteSize.x - radiusC, this.absolutePosition.y + this.absoluteSize.y);
      context.arcTo(this.absolutePosition.x + this.absoluteSize.x, this.absolutePosition.y + this.absoluteSize.y, this.absolutePosition.x + this.absoluteSize.x, this.absolutePosition.y + this.absoluteSize.y - radiusC, radiusC);
      
      context.lineTo(this.absolutePosition.x + this.absoluteSize.x, this.absolutePosition.y + radiusB);
      context.arcTo(this.absolutePosition.x + this.absoluteSize.x, this.absolutePosition.y, this.absolutePosition.x + this.absoluteSize.x - radiusB, this.absolutePosition.y, radiusB);
      
      context.lineTo(this.absolutePosition.x + radiusA, this.absolutePosition.y);
      context.arcTo(this.absolutePosition.x, this.absolutePosition.y, this.absolutePosition.x, this.absolutePosition.y + radiusA, radiusA);
      
      context.fill();
    } else context.fillRect(this.absolutePosition.x, this.absolutePosition.y, this.absoluteSize.x, this.absoluteSize.y);
  }
}

export class TextLabel extends Frame {
  textFill = "black";
  wrapText = true;
  condenseText = false;
  
  #text = "TextLabel";
  #textHorizontalAlign = "center";
  #textVerticalAlign = "middle";
  #font = "Segoe UI";
  #fontSize = 14;
  #lineHeight = 1.5;
  #textPadding = 5;
  
  set text(value) { this.#text = value; this.#relayoutText = true; }
  set textHorizontalAlign(value) { this.#textHorizontalAlign = value; this.#relayoutText = true; }
  set textVerticalAlign(value) { this.#textVerticalAlign = value; this.#relayoutText = true; }
  set font(value) { this.#font = value; this.#relayoutText = true; }
  set fontSize(value) { this.#fontSize = value; this.#relayoutText = true; }
  set lineHeight(value) { this.#lineHeight = value; this.#relayoutText = true; }
  set textPadding(value) { this.#textPadding = value; this.#relayoutText = true; }
  
  get text() { return this.#text; }
  get textHorizontalAlign() { return this.#textHorizontalAlign; }
  get textVerticalAlign() { return this.#textVerticalAlign; }
  get font() { return this.#font; }
  get fontSize() { return this.#fontSize; }
  get lineHeight() { return this.#lineHeight; }
  get textPadding() { return this.#textPadding; }
  
  #relayoutText = true;
  #lines = [];
  
  draw(context) {
    super.draw(context);
    
    context.fillStyle = this.textFill;
    context.font = `${this.#fontSize}px ${this.#font}, system-ui`;
    
    let [textX, textY] = [this.absolutePosition.x + this.absoluteSize.x * 0.5, this.absolutePosition.y + this.#textPadding];

    if (this.wrapText) {
      if (this.#relayoutText) {
        this.#lines = [];
        
        context.textAlign = this.#textHorizontalAlign;
        if (this.#textHorizontalAlign === "left") {
          textX = this.absolutePosition.x + this.#textPadding;
        } else if (this.#textHorizontalAlign === "right") textX = this.absolutePosition.x + this.absoluteSize.x - this.#textPadding;

        if (this.#textVerticalAlign === "middle") {
          context.textBaseline = "middle";
          textY = this.absolutePosition.y + this.absoluteSize.y * 0.5;
        } else if (this.#textVerticalAlign === "bottom") {
          context.textBaseline = "alphabetic";
          textY = this.absolutePosition.y + this.absoluteSize.y - this.#textPadding;
        } else context.textBaseline = "top";

        const words = this.#text.split(" ");
        let line = "";

        for (const word of words) {
          const currentLine = line + word + " ";
          if (context.measureText(currentLine).width > this.absoluteSize.x - this.#textPadding * 2) {
            this.#lines.push(line);
            line = word + " ";
          } else line = currentLine;
        }

        this.#lines.push(line);

        this.#relayoutText = false;
      }
      
      for (let i = 0; i < this.#lines.length; i++) context.fillText(this.#lines[i], textX, textY - (((this.#lines.length - 1) * this.#lineHeight * this.#fontSize * 0.5) * (this.#textVerticalAlign === "bottom" ? 2 : (this.#textVerticalAlign === "top" ? 0 : 1)) ) + (i * this.#lineHeight * this.#fontSize));
    } else context.fillText(this.#text, textX, textY, this.condenseText ? this.absoluteSize.x - this.#textPadding * 2 : undefined);
  }
}

export class ShadowEffect extends ui.UIModifier {
  shadowBlur = 10;
  shadowColor = "rgba(0, 0, 0, 0.35)";
  shadowOffset = new ui.Position2D(0, 6);
  
  drawBefore(context) {
    context.shadowBlur = this.shadowBlur;
    context.shadowColor = this.shadowColor;
    context.shadowOffsetX = this.shadowOffset.x;
    context.shadowOffsetY = this.shadowOffset.y;
  }
  
  drawAfter(context) {
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }
}