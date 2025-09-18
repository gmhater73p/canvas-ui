# canvas-ui

(from 2021)

Proof of concept of a pure JavaScript + [Web Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) GUI framework.

Partly inspired by the Roblox GUI system; as such, the [coordinate system](https://create.roblox.com/docs/reference/engine/datatypes/UDim) is the same and uses pixel offsets + decimal fraction of the screen for positioning and scaling.

**Why this could have been a good idea:**
* Ability to position elements with more flexibility than the DOM
* Adding/removing elements is more performant than the DOM. Useful for applications that need to show lots of data, for example.
* Lower latency (with desynchronized canvas)
* Custom components and layout rules
* Sandboxing

**Why this, in retrospect, was a bad idea:**
* Poor accessibility support compared to the DOM
* Lower performance compared to the DOM
