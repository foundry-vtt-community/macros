(async () => {
    if (actor) {
        for ( let token of canvas.tokens.controlled ) {
            let messageContent = '';
                if ((token.actor.data.data.customModifiers['crafting'] || []).some(modifier => modifier.name === 'Specialty Crafting')) {
                    await token.actor.removeCustomModifier('crafting', 'Specialty Crafting');

                    if (token.data.effects.includes("systems/pf2e/icons/equipment/adventuring-gear/hammer.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/equipment/adventuring-gear/hammer.jpg")
                    }

                } else {
                    await token.actor.addCustomModifier('crafting', 'Specialty Crafting', +1, 'status');

                    if (!token.data.effects.includes("systems/pf2e/icons/equipment/adventuring-gear/hammer.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/equipment/adventuring-gear/hammer.jpg")
                    }

                };
                // create the message 

                if (messageContent !== '') {
                    let chatData = {
                        user: game.user._id,
                        speaker: ChatMessage.getSpeaker(),
                        content: messageContent,
                    };

                    await ChatMessage.create(chatData, {});
                }
        }
    } else {
        ui.notifications.warn("You must have an actor selected.");
    }
})();