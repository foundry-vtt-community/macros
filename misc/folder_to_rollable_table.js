// Take the entries of a folder and turn it into a rollable table
// Author: @Atropos#3814

const folder = game.folders.getName("Herbalism & Alchemy");
const table = game.tables.getName("Common Ingredients");
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
