// Courtesy of @ohporter
// Cause lightsources to "breathe," expanding and contracting.
(async () => {
    let min = 5;
    let max = 10;
    if (game.pulsatingLights) {
      game.pulsatingLights = false;
    } else {
      game.pulsatingLights = true;
      let glyphLights = [];
      let glyphColor = "#5940b5"
      let scene = game.scenes.active;
  
      canvas.lighting.placeables.forEach(l => { if (l.data.tintColor === glyphColor && l.scene === scene) glyphLights.push(l.id) })
  
      const updates = []
  
      let radius = min;
      let increment = true;
      let interval = setInterval(async () => {
        glyphLights.forEach(id => {
          updates.push({ _id: id, dim: radius, bright: radius/2});
        })
        await scene.updateEmbeddedEntity("AmbientLight", updates);
  
        if (increment) {radius += 1} else {radius -= 1};
        if (radius === max) {increment = false};
        if (radius === min) {increment = true};
        if (!scene.active || !game.pulsatingLights) {
          // Reset to default glow
          glyphLights.forEach(id => {
            updates.push({ _id: id, dim: min, bright: 0});
          })
          await scene.updateEmbeddedEntity("AmbientLight", updates);
          clearInterval(interval);
        }
      }, 200);
    }
  })()