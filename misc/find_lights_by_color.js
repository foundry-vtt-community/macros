// Courtesy of @FloRad
// Right here's a macro that looks for lights of a certain color, 
// sets a different color and then logs out the ids of the 
// lights it previously found using the marker color
(async () => {
    let foundLights = [];
    let markingColor = "#00ff00"
    let newColor = "#bbb"
    let scene = game.scenes.active;

    canvas.lighting.placeables.forEach(l => { if (l.data.tintColor === markingColor && l.scene === scene) foundLights.push(l.id) })

    const updates = []
    foundLights.forEach(id => {
        updates.push({ _id: id, tintColor: newColor });
    })

    await scene.updateEmbeddedEntity("AmbientLight", updates);

    console.log(foundLights)
})()