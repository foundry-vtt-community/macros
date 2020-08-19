// Simple macro to loop through ALL SELECTED TILES and toggle whether or not they are hidden.
// Uncomment line 8 or 9 to change behavior to hide / show all tiles instead of toggle

if (canvas.tiles.controlled[0]) {
  canvas.tiles.controlled.forEach(tile => {
    let v;
    v = !tile.data.hidden; // Toggle visibility for each tile
    // v = false;          // Hide all selected tiles
    // v = true;           // Show all selected tiles
    tile.update({ hidden: v });
  });
} else {
  ui.notifications.notify("Please select at least one tile.");
}
