const unlinked = canvas.scene.data.tokens.map(t => {
    const actor = game.actors.find(a => a.name === t.name);
    if (actor) {
        return {
            _id: t.id,
            actorId: actor.id
        }
    } else { // this may include actors who's actor name is not the same as the token name (see Starter Heroes)
        console.log(t.name);
        return {
            _id: t.id,
            actorId: ""
        }
    }
});
const updates = duplicate(unlinked);
canvas.scene.updateEmbeddedDocuments("Token", updates);

ui.notifications.info('Tokens linked to actors.');
//console.log(updates);