/**
 * Locks all closed doors on the canvas
 * Author: orcnog
 */
 
 await canvas.walls.updateAll(w => ({ds: w.data.ds === CONST.WALL_DOOR_STATES.CLOSED ? CONST.WALL_DOOR_STATES.LOCKED : CONST.WALL_DOOR_STATES.CLOSED}), w => w.data.door === CONST.WALL_DOOR_TYPES.DOOR && (w.data.ds ===  CONST.WALL_DOOR_STATES.LOCKED || w.data.ds ===  CONST.WALL_DOOR_STATES.CLOSED));