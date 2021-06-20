/**
 * Closes all doors on the canvas
 * Author: @Atropos#3814
 */
 
canvas.scene.updateEmbeddedDocuments("Wall", canvas.scene.data.walls.map(w => {
  return {_id: w.id, ds: w.data.ds === 1 ? 0 : w.data.ds};
}));
