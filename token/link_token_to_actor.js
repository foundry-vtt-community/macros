(() => {
    const scene = game.scenes.active;
    const unlinked = canvas.scene.data.tokens.map(t => {
        const actor = game.actors.entities.find(a => a.name === t.name);
        if (actor) {
            return {
                _id: t._id,
                actorId: actor.id
            }
        } else {
            console.log(t.name);
            return {
                _id: t._id,
                actorId: ""
            }
        }
    });
    const updates = duplicate(unlinked);

    scene.updateEmbeddedEntity("Token", updates);

    ui.notifications.info('Tokens linked to actors.');
    console.log(updates);
})();