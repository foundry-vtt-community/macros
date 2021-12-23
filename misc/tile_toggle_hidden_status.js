// Simple macro to loop through ALL SELECTED TILES and toggle whether or not they are hidden.
// Uncomment line 8 or 9 to change behavior to hide / show all tiles instead of toggle
const tiles = canvas.background.controlled.length ? canvas.background.controlled : canvas.foreground.controlled;
const updates = tiles.map(tile => {
    let v;
    v = !tile.data.hidden; // Toggle visibility for each tile
    // v = false;          // Hide all selected tiles
    // v = true;           // Show all selected tiles
    return{ _id: tile.id, hidden: v };
});
canvas.scene.updateEmbeddedDocuments("Tile", updates);