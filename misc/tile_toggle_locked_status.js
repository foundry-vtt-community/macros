//Simple macro to loop through ALL SELECTED TILES and toggle their locked status.
//In other words:
    //If an individual tile is unlocked, this macro will lock it.
    //If an individual tile is locked, this macro will unlock it.

if (canvas.tiles.controlled[0]) {
    canvas.tiles.controlled.forEach(tile => {
        tile.update({ locked: !tile.data.locked});
    });
} else {
    ui.notifications.notify("Please select at least one tile.");
}
