/**
 * Import folder into writable compendium. Locked compendiums will not show as an option.
 * Folder type is optional, however will help if you have the same folder name across multiple system types.
 * Also contains options to store subfolder contents, update existing records (or only add new), and delete duplicate records.
 * Author: KrishMero#1792
 */

let packOptions = game.packs.filter(pack => !pack.locked).map(pack => `<option value="${pack.collection}">${pack.title}</option>`);
let entityType = COMPENDIUM_ENTITY_TYPES.map(type => `<option value="${type}">${type}</option>`);
const form = `
  <div style="display: inline-block; width: 100px">Folder:</div>
  <input type="string" id="folderName">
  <br />

  <div style="display: inline-block; width: 100px">Folder Type:</div>
  <select id="entityType" />
    <option value="">--</option>
    ${entityType}
  </select>
  <br />

  <div style="display: inline-block; width: 100px">Compendium:</div>
  <select id="destinationPack" />
    ${packOptions}
  </select>
  <br />

  <label>
    <input type="checkbox" id="recurse" checked/>
    Store subfolders too
  </label>
  <br />

  <label>
    <input type="checkbox" id="update" checked/>
    Update existing records (unchecked = only add new)
  </label>
  <br />

  <label>
    <input type="checkbox" id="delete" checked/>
    Delete duplicates
  </label>
`;

const dialog = new Dialog({
  title: "Store folder in compendium",
  content: form,
  buttons: {
    use: {
      label: "Apply",
      callback: storeFolder
    }
  }
}).render(true);

function storeFolder(html) {
  const folderName = html.find(`input#folderName`)[0].value;
  const folderType = html.find(`select#entityType`)[0].value;
  const destinationPack = html.find(`select#destinationPack`)[0].value;
  const recurse = html.find(`input#recurse`)[0].checked;
  const update = html.find(`input#update`)[0].checked;
  const deleteRecords = html.find(`input#delete`)[0].checked;
  
  let folders = game.folders.filter(f => f.name === folderName);
  if (folderType) {
    folders = folders.filter(f => f.type === folderType);
  }
  if (folders.length === 0) {
    ui.notifications.error(`Your world does not have any folders named '${folderName}'.`);
  }
  else if(folders.length > 1) {
    ui.notifications.error(`Your world has more than one folder named ${folderName}`) 
  }
  else {
    console.log(`storing in ${destinationPack}`);
    let packObject = game.packs.get(destinationPack);
    storeRecursively(folders[0], packObject, recurse, update, deleteRecords);
    ui.notifications.notify(`'${folderName}' stored successfully in '${packObject.title}'.`);
  }
}

function storeRecursively(currentFolder, packObject, recurse, update, deleteRecords) {
  console.log('store recursively for ' + currentFolder.name);
  if (currentFolder.content) {
    currentFolder.content.map(item => {
      console.debug("  Item:", item.data.name);
      let existingRecords = packObject.index.filter(i => i.name === item.data.name);
      if (item.data.name === 'Augury') {
        console.log(existingRecords);
        console.log(existingRecords.length);
      }

      // Delete all but the first duplicate.
      if(existingRecords.length > 1) {
        if (deleteRecords) {
          console.log(existingRecords);
          existingRecords.shift();
          existingRecords.map(record => packObject.deleteEntity(record._id));
        } else {
          console.log(`Skipped: ${existingRecords[0].name}`)
          ui.notifications.error(`Can't store '${existingRecords[0].name}' as multiple records were found. Delete the extras or check 'Delete duplicates'. Logged to console.`);
        }
      }

      if (existingRecords.length === 1 && update) {
        packObject.updateEntity(existingRecords[0]);
      } else if (!existingRecords.length) {
        packObject.createEntity(item);
      }
      
    });
  }

  if (currentFolder.children && recurse) {
    currentFolder.children.map(({ data }) => {
      storeRecursively(
        game.folders.entities.filter(f => f.data._id == data._id)[0],
        packObject,
        recurse, 
        update,
        deleteRecords
      );
    });
  }
}
