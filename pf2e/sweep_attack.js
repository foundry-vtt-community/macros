(async () => {
    if (actor) {
        for ( let token of canvas.tokens.controlled ) {
            let messageContent = '';
                if ((token.actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Sweep Attack')) {
                    await token.actor.removeCustomModifier('attack', 'Sweep Attack');

                    if (token.data.effects.includes("systems/pf2e/icons/equipment/weapons/battle-axe.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/equipment/weapons/battle-axe.jpg")
                    }
                } else {
                    await token.actor.addCustomModifier('attack', 'Sweep Attack', 1, 'status');

                    if (!token.data.effects.includes("systems/pf2e/icons/equipment/weapons/battle-axe.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/equipment/weapons/battle-axe.jpg")
                    }

                    messageContent = 'Readies to Strike a new foe!'
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