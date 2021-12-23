// Flips the selected token image along the Y axis.
// Change mirrorY to mirrorX to flip across the X axis
const updates = canvas.tokens.controlled.map(t => ({_id: t.id, mirrorY: !t.data.mirrorY}));
await canvas.scene.updateEmbeddedDocuments("Token", updates);