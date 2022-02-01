// Allows swapping between two different .png images.
// Token sides should have "a" and "b" at the end of the name like "name-a.png" and "name-b.png".
// If you have a different ending, change aName and bName respectively.
// Author: Phenomen

// IMPORTANT. These two values MUST be the same length.
let aName = 'a.png'
let bName = 'b.png'

let tok = canvas.tokens.controlled[0];
let img = tok.data.img;
var currentSide = img[img.length - aName.length];
img = img.slice(0,-Math.abs(aName.length)) + (currentSide == 'a' ? bName: aName);
tok.document.update({ img });
