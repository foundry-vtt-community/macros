//Simple macro to loop through ALL SELECTED TILES and adjust their position by a set amount

//Questions? Ask in Foundry VTT Discord #macro-polo channel. If absolutely needed, ping @Norc$5108

async function adjustTileXY(tile, xAdjust, yAdjust ) {
    await tile.update({
        x: tile.x + xAdjust,
        y: tile.y + yAdjust,
    });
}

//check to make sure at least one tile is selected
if (canvas.tiles.controlled[0]) {
    //loop through all selected tiles
    for (let t of canvas.tiles.controlled) {
        //REPLACE THE "1" VALUES BELOW AS NEEDED
            //The first number controls side-to-side position:
                //Positive values move tiles to the right
                //Negative values move tiles to the left
                //If you enter 0, tiles will not move side to side at all.
            //The second number controls up-and-down position:
                //Positive values move tiles down
                //Negative values move tiles up
                //If you enter 0, tiles will not move up or down at all.
        adjustTileXY(t, 1, 1);
    }
} else {
    ui.notifications.notify("Please select at least one tile.");
}