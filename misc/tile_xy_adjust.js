//Simple macro to loop through ALL SELECTED TILES and adjust their position by a set amount
//Questions? Ask in Foundry VTT Discord #macro-polo channel. If absolutely needed, ping @Norc$5108

async function adjustTilesXY(tiles, xAdjust, yAdjust ) {
    const updates = tiles.map(tile => ({
        _id: tile.id,
        x: tile.x + xAdjust,
        y: tile.y + yAdjust,
    }));
    await canvas.scene.updateEmbeddedDocuments("Tile", updates)
}

const tiles = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
if(!tiles.length) return ui.notifications.info("No tiles selected.")
//loop through all selected tiles
//REPLACE THE "1" VALUES BELOW AS NEEDED
    //The first number controls side-to-side position:
        //Positive values move tiles to the right
        //Negative values move tiles to the left
        //If you enter 0, tiles will not move side to side at all.
    //The second number controls up-and-down position:
        //Positive values move tiles down
        //Negative values move tiles up
        //If you enter 0, tiles will not move up or down at all.
await adjustTilesXY(tiles, 1, 1);