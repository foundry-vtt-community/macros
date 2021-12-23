//Simple macro to loop through ALL SELECTED TILES and toggle their locked status.
//In other words:
    //If an individual tile is unlocked, this macro will lock it.
    //If an individual tile is locked, this macro will unlock it.

    const tiles = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
    const updates = tiles.map(tile => ({ _id: tile.id, locked: !tile.data.locked }));
    canvas.scene.updateEmbeddedDocuments("Tile", updates);