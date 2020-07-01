//Simple macro to loop through ALL SELECTED TILES and toggle their locked status.
//In other words:
    //If an individual tile is unlocked, this macro will lock it.
    //If an individual tile is locked, this macro will unlock it.
//Bonus function to lock or unlock all tiles instead also included.

//Questions? Ask in Foundry VTT Discord #macro-polo channel. If absolutely needed, ping @Norc$5108

async function toggleTileLock(tile) {
    await tile.update({locked: !tile.data.locked});
    }

async function setTileLock(tile, trueOrFalse) {
    await tile.update({locked: trueOrFalse});
}

//check to make sure at least one tile is selected
if (canvas.tiles.controlled[0]) {
    //loop through all selected tiles
    for (let t of canvas.tiles.controlled) {
        await toggleTileLock(t);
        //lock all tiles instead
        //await setTileLock(t,true);
        //unlock all tiles instead
        //await setTileLock(t,false); 
    }
} else {
    ui.notifications.notify("Please select at least one tile.");
}