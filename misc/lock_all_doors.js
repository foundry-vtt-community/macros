/**
 * Locks all closed doors on the canvas
 * Author: orcnog
 */
 
canvas.walls.updateMany(canvas.scene.data.walls.map(w => {
  return {_id: w._id, ds: w.ds === 0 ? 2 : w.ds};
}));
