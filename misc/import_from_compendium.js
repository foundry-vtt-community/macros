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
   const doc = pack.documentName;
   let folder = folderName ? findFolder(folderName, doc) : await createFolder(pack, doc);
   
   if (!folder) return ui.notifications.error(`Your world does not have any ${doc} folders named '${folderName}'.`);
   console.log(folder.id)
   if (remove) removeDataFirst(folder.id, doc);
   if (folder) importPack(pack, doc, folder.id)
 }
 
 async function importPack(pack, doc, folderId) {
   const docClass = CONFIG[doc].documentClass;
   const content = await pack.getDocuments();
   const createData = content.map(c => {
     let data = c.toObject();
     data.folder = folderId;
     return data;
   });
   docClass.createDocuments(createData);
 }
 
 async function removeDataFirst(folderId, doc) {
   let type = getDocType(doc);
   const removeableData = game[type].filter(t => t.data.folder === folderId);
   CONFIG[doc].documentClass.deleteDocuments(removeableData.map(e=>e.id));
   // if (typeof removeableData.delete !== "undefined") {
   //   removeableData.delete();
   // } else {
   //   removeableData.map(d => d.delete());
   // }
 }
 
 async function createFolder(pack, type) {
   let name = pack.metadata.label;
   if(game.folders.getName(name)) return game.folders.getName(name);
   let folder = await Folder.createDocuments([{ name, type, parent: null}]);
   return folder[0];
 }
 
 function findFolder(folderName, doc)
 {
   return game.folders.find(f => f.name === folderName && f.type === doc)
 }
 
 function getDocType(doc) {
   switch (doc) {
     case 'JournalEntry': return 'journal';
     case 'RollTable': return 'tables';
     default: return doc.toLowerCase() + 's';
   }
 }