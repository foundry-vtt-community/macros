// Courtesy of @FloRad, Updated by scooper4711 
// This macro is intended to perform a batch update
// of all lights in the current scene e.g. after
// importing from Unversal Battle Map importer,
// allowing you to set e.g. all wall torches identically.
(async () => {
        let foundLights = [];
        let markingColor = "#eccd8b"
        let newColor = "#fec80a"
        let scene = game.scenes.active;
    
        canvas.lighting.placeables.forEach(l => { if (l.data.tintColor === markingColor && l.scene === scene) foundLights.push(l.id) })
    
        const updates = []
        foundLights.forEach(id => {
            updates.push({ _id: id, 
                            tintColor: newColor, 
                            darkness: {min:0.2, max:1.0}, 
                            dim: 10, 
                            bright: 5, 
                            lightAnimation: {speed: 1, intensity: 3, type: "torch"} });
        })
    
        await scene.updateEmbeddedEntity("AmbientLight", updates);
    
        console.log(foundLights)
    })()
