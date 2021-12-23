/**
 * Deletes all templates on the current scene
 */
 
// no dialog. Just delete all templates.
canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", canvas.templates.placeables.map(o =>o.id));

// Get a dialog confirmation before deleting all templates on the scene:
// canvas.templates.deleteAll()
