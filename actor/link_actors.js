// Finds unlinked actors on the current scene and updates actor based on the name.
// Actor names not found in your game will be displayed in the console.

let unlinked = canvas.scene.data.tokens.filter(a => a.actorLink === false);

unlinked.forEach(t => {
    let tok = canvas.tokens.get(t._id);
    let link = game.actors.entities.find(a => a.name === t.name);
    if (link) {
        tok.update({
            // If you need your actors actually linked (HP updated on the sheet. Not usually needed for NPCs) uncomment the line below.
            // actorLink: true, // THIS WILL LINK EVERY ACTOR ON THE SCENE AND IS NOT RECOMMENDED FOR NPCs
            actorId: link._id
        })
    } else {
        console.log('Actor not found: ' + tok.name);
    }
});

ui.notifications.info('Tokens linked to actors.');