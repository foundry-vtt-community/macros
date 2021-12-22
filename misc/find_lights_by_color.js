// Courtesy of @FloRad, Updated by scooper4711, updated for v9 by Freeze#2689
// This macro is intended to perform a batch update
// of all lights in the current scene e.g. after
// importing from Unversal Battle Map importer,
// allowing you to set e.g. all wall torches identically.
let markingColor = "#ff0000"//"#eccd8b"
let newColor = "#fec80a"
let scene = game.scenes.active;

const foundLights = canvas.lighting.placeables.reduce((acc, l) => { 
    if (l.data.config.color === markingColor && l.scene.id === scene.id) acc.push(l) 
    return acc
}, []);
const updates = foundLights.map(light => ({ 
    _id: light.id, 
    config: {
        color: newColor, 
        darkness: {min:0.2, max:1.0}, 
        dim: 10, 
        bright: 5, 
        animation: {speed: 1, intensity: 3, type: "torch"} 
    }
}));

await scene.updateEmbeddedDocuments("AmbientLight", updates);
