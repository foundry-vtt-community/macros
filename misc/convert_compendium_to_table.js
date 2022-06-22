/* 
 * Macro: GeekDad's Compendium to Table Script
 * Version: 2
 * Updated: 06-21-2022
 * Description: A nice friendly UI that takes a compendium and appends it to a table.
*/

function getPackNames() {
 const itemPacks = game.packs.filter((pack) => pack.metadata.type === "Item");
 return itemPacks.map((pack) => {
  if (pack.metadata.type === "Item") {
   return {key: pack.collection, name: pack.metadata.label} 
  }
 });
}

function getTableNames() {
 return game.tables.map(table => {
  return { key: table.id, name: table.name };
 });
}

async function convertToTable(packKey, tableKey) {
  let pack = game.packs.get(packKey);
  let table = game.tables.get(tableKey);

  const entityType = "Compendium";
  await pack.getIndex();
  let range = 0;
  
  const results = pack.index.map(i => {
   range++;
   return {
    text: i.name,
    type: 2,
    collection: packKey,
    resultId: i._id,
    img: i.img,
    weight: 1,
    range: [range, range],
    drawn: false
   }
  });

  await table.createEmbeddedDocuments("TableResult", results);

  await table.update({formula: "1d" + results.length});
}

let itemPacks = getPackNames();
let tables = getTableNames();

let content = `<form><div style="display: inline-block; width: 100%; margin-bottom: 10px">
  <p>This script will append the selected compendium to the selected table.  If you want to a new table created, create it an empty table prior to running this script.</p>
  <label for="output-targetPack" style="vertical-align: top; margin-right: 10px;">Select Pack:</label>
  <br /><select name='output-targetPack' id='output-targetPack'>`

itemPacks.forEach(item => {
 content += `<option value='${item.key}'>${item.name}</option>`;
});

content += `</select><br/><label for="output-tableKey" style="vertical-align: top; margin-right: 10px;">Table Name:</label><br /><select name="output-tableKey" id="output-tableKey">`

tables.forEach(table => {
 content += `<option value='${table.key}'>${table.name}</option>`;
});

content += `</select></div><br /></form>`

 new Dialog({
  title: `GeekDad's Compendium to Rolltable Converter`,
  content: content,
  buttons: {
   yes: {
    icon: "<i class='fas fa-check'></i>",
    label: "Convert",
    callback: (html) => {
     let packKey = html.find("select[name='output-targetPack']").val();
     let tableKey = html.find("select[name='output-tableKey']").val();
     convertToTable(packKey, tableKey);
    }
   },
   no: {
    icon: "<i class='fas fa-times'></i>",
    label: 'Cancel'
   }
  },
  default: "yes"
 }).render(true);
