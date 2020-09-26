// Take the entries of a folder and turn it into a rollable table.
// NOTE: you must click the "Normalize Result Weights" button (scale icon) after import.
// Author: @Atropos#3814

// name of folder whos entities you wish to push into a rollable table.
const folder = game.folders.getName("Herbalism & Alchemy");
// name of table you will be overwriting
const table = game.tables.getName("Common Ingredients");
// change this to match the entity type you are importing.
// Actor, Item, Scene, JournalEntry, Macro, RollTable, Playlist
const entityType = "Item"

const items = folder.entities;
const results = folder.entities.map(i => {
  return {
    text: i.data.name,
    type: 1,
    collection: "Item",
    resultId: i.data._id,
    img: i.data.img,
    weight: 1,
    range: [1, 1],
    drawn: false
  }
});
await table.createEmbeddedEntity("TableResult", results);
