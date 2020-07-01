//Simple macro to loop through ALL SELECTED TILES and toggle whether or not they are hidden.
//In other words:
    //If an individual tile is visible, this macro will hide it.
    //If an individual tile is hidden, this macro will make it visible.
//Bonus function to hide or unhide tiles instead also included.

async function toggleTileVisibility(tile) {
    console.log(tile.data.hidden);
    console.log(!tile.data.hidden);
    await tile.update({hidden: !tile.data.hidden});
    }

async function setTileHidden(tile, trueOrFalse) {
    await tile.update({hidden: trueOrFalse});
}

//check to make sure at least one tile is selected
if (canvas.tiles.controlled[0]) {
    //loop through all selected tiles
    for (let t of canvas.tiles.controlled) {
        await toggleTileVisibility(t);
        //hide all selected tiles instead
        //await setTileHidden(t,true);
        //show all selected tiles instead
        //await setTileHidden(t,false);
    }
} else {
    ui.notifications.notify("Please select at least one tile.");
}