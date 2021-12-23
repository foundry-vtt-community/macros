// Fine Tile Control //

// This is a series of 6 macros that you must paste individually into a new
// Hot Bar Macro Sheet and save. The Hot Bar number is used to activate the macro.
// Hold down the Control key to halve the distance increment from 1 to 0.5.
// CAUTION: If the ctrl key doesn‘t check your operating system and/or move the
// macro to another cell.
// NOTE: Any locked tiles are ignored.

// Move Up
// By @cole$9640

const amount = event.ctrlKey ? -0.5 : -1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
    .filter((tile) => !tile.data.locked)
    .map((tile) => ({
      _id: tile.id,
      y: tile.y + amount,
    }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}

// Move Down
// By @cole$9640

const amount = event.ctrlKey ? 0.5 : 1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
    .filter((tile) => !tile.data.locked)
    .map((tile) => ({
      _id: tile.id,
      y: tile.y + amount,
    }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}

// Move Right
// By @cole$9640

const amount = event.ctrlKey ? 0.5 : 1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
    .filter((tile) => !tile.data.locked)
    .map((tile) => ({
      _id: tile.id,
      x: tile.x + amount,
    }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}

// Move Left
// By @cole$9640

const amount = event.ctrlKey ? -0.5 : -1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
    .filter((tile) => !tile.data.locked)
    .map((tile) => ({
      _id: tile.id,
      x: tile.x + amount,
    }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}

// Rotate Left
// Original by @Norc$5108, updated and refined by @cole$9640 & @Drunemeton$7955

const amount = event.ctrlKey ? -0.5 : -1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
  .filter((tile) => !tile.data.locked)
  .map((tile) => ({
    _id: tile.id, 
    rotation: tile.data.rotation + amount 
  }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}

// Rotate Right
// Original by @Norc$5108, updated and refined by @cole$9640 & @Drunemeton$7955

const amount = event.ctrlKey ? 0.5 : 1;
const tiles = canvas.background.controlled.length === 0 ? canvas.foreground.controlled : canvas.background.controlled;
if (tiles.length) {
  const updates = tiles
  .filter((tile) => !tile.data.locked)
  .map((tile) => ({
    _id: tile.id, 
    rotation: tile.data.rotation + amount 
  }));
  canvas.scene.updateEmbeddedDocuments("Tile", updates);
} else {
  ui.notifications.notify("Please select at least one tile.");
}