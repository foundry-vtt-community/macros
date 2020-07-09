/** 
 * Import all the entries from a compendium into the desired folder.
 * @Author: KrishMero#1702
 */
 
let packOptions = game.packs.map(pack => `<option value="${pack.collection}">${pack.title}</option>`);
const form = `
  <div style="display: inline-block; width: 100px">Folder:</div>
  <input type="string" id="folderName">
  <br />
  <div style="font-size: 80%">leave blank to create a folder after the compendium name</div>
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

async function importCompendium(html) {
  const folderName = html.find(`input#folderName`)[0].value;
  const packName = html.find(`select#destinationPack`)[0].value;
  const remove = html.find(`input#delete`)[0].checked;

  const pack = game.packs.get(packName);
  const entity = pack.entity;
  let folder = folderName ? findFolder(folderName, entity) : await createFolder(pack, entity);
  
  if (!folder) return ui.notifications.error(`Your world does not have any ${entity} folders named '${folderName}'.`);

  if (remove) removeDataFirst(folder.id, entity);
  if (folder) importPack(pack, entity, folder.id)
}

async function importPack(pack, entity, folderId) {
  const entityClass = CONFIG[entity].entityClass;
  const content = await pack.getContent();

  const createData = content.map(c => {
    c.data.folder = folderId;
    return c.data;
  });
  entityClass.create(createData);
}

function removeDataFirst(folderId, entity) {
  let type = getEntityType(entity);
  const removeableData = game[type].filter(t => t.data.folder === folderId);
  if (typeof removeableData.delete !== "undefined") {
    removeableData.delete();
  } else {
    removeableData.map(d => d.delete());
  }
}

async function createFolder(pack, type) {
  let name = pack.metadata.label;
  let folder = await Folder.create({ name, type, parent: null});
  return folder;
}

function findFolder(folderName, entity)
{
  return game.folders.find(f => f.name === folderName && f.type === entity)
}

function getEntityType(entity) {
  switch (entity) {
    case 'JournalEntry': return 'journal';
    case 'RollTable': return 'tables';
    default: return entity.toLowerCase() + 's';
  }
}
