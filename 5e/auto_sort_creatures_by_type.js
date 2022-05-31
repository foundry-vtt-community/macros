/** ##################################################################################### *
 *  This macro loops over the existing creature actors in the actor directory and creates *
 *  folders corresponding to the creature type. It then sorts the creatures to the        *
 *  corresponding folder to make them quiet a bit more manageable, especially when you've *
 *  created/imported a lot of creatures.                                                  *
 *  I would recommend using the "Compendium Folders" module in combination to keep your   *
 *  initial load as fast as possible when you have a lot of actors.                       *
 *  ##################################################################################### *
 *  Credits to ZetaDracon#7558 and Freeze#2689                                            *
 *  ##################################################################################### */
const folderData = {
    color: "",
    parent: "",
    sorting: "a",
    type: "Actor"
};
// lets make the folders.
for(let actor of game.actors) {
    const type = actor.data.data.details.type?.value;
    if(!type) continue; // so player characters get filtered out.
    const folder = game.folders.find(f => f.name.toLowerCase() === type && f.type === "Actor");
    if(!folder) await Folder.create(mergeObject({name: type}, folderData));
}
// lets update the actors.
const updates = game.actors.reduce((acc, a) => {
    const type = a.data.data.details.type?.value;
    if(!type) return acc;  // so player characters get filtered out.
    let folderId = game.folders.find(f => f.name.toLowerCase() === type && f.type === "Actor").id;
    acc.push({_id: a.id, folder: folderId});
    return acc;
}, []);
await Actor.updateDocuments(updates);