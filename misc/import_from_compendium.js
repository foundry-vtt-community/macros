/** 
 * Import all the actors from a compendium.
 * In order to find the packName, you can use the following in your console (F12): game.packs.map(p => p.collection);
 * Author: KrishMero#1702
 */
 
let packOptions = game.packs.map(pack => `<option value="${pack.collection}">${pack.title}</option>`);
const form = `
  <div style="display: inline-block; width: 100px">Folder:</div>
  <input type="string" id="folderName">
  <br />
  <div style="font-size: 80%">leave blank to put into root directory</div>
  <br />

  <div style="display: inline-block; width: 100px">Compendium:</div>
  <select id="destinationPack" />
    ${packOptions}
  </select>
  <br />

  <label>
    <input type="checkbox" id="delete"/>
    Clear destination first
  </label>
`;

const dialog = new Dialog({
  title: "Import data from compendium",
  content: form,
  buttons: {
    use: {
      label: "Apply",
      callback: importCompendium
    }
  }
}).render(true);

function importCompendium(html) {
  const folderName = html.find(`input#folderName`)[0].value;
  const packName = html.find(`select#destinationPack`)[0].value;
  const remove = html.find(`input#delete`)[0].checked;

  let pack = game.packs.get(packName);
  let folder = game.folders.find(f => f.name === folderName && f.type === pack.entity)?.id;
  let type = getEntityType(pack);
  let extra = folder ? { folder } : null

  if (folderName && !folder) {
    return ui.notifications.error(`Your world does not have any ${type} folders named '${folderName}'.`);
  }

  if (remove) removeDataFirst(type, folder);
  pack.getIndex().then(index => index.forEach(entry => game[type].importFromCollection(packName, entry._id, extra)));
}
    
function getEntityType(pack) {
  const entity = pack.metadata.entity;
  switch (entity) {
    case 'JournalEntry': return 'journal';
    case 'RollTable': return 'tables';
    default: return entity.toLowerCase() + 's';
  }
}

function removeDataFirst(type, folder) {
  let removableData = game[type].filter(t => t.data.folder === folder);
  if (typeof removableData.delete !== "undefined") {
    removableData.delete();
  } else {
    removableData.map(d => d.delete());
  }
}
