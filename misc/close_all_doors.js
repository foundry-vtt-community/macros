/**
 * Closes all doors on the canvas
 * Author: @Atropos#3814
 */
 
canvas.walls.updateMany(canvas.scene.data.walls.map(w => {
  return {_id: w._id, ds: w.ds === 1 ? 0 : w.ds};
}));
