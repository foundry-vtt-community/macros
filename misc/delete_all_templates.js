/**
 * Deletes all templates on the current scene
 */
 
 canvas.templates.deleteMany(canvas.templates.placeables.map(o =>o.id),{});
