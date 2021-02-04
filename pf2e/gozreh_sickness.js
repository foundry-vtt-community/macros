(async () => {
    if (actor) {
        for ( let token of canvas.tokens.controlled ) {
            let messageContent = '';
                if ((token.actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Gozreh Sickness')) {
                    await token.actor.removeCustomModifier('attack', 'Gozreh Sickness');
                    await token.actor.removeCustomModifier('damage', 'Gozreh Sickness');
                    await actor.removeCustomModifier("ac", "Gozreh Sickness");
                    await actor.removeCustomModifier("fortitude", "Gozreh Sickness");

                    if (token.data.effects.includes("systems/pf2e/icons/spells/daze.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/spells/daze.jpg")
                    }

                    messageContent = 'Is no longer Sickened by Gozreh!'
                } else {
                    await token.actor.addCustomModifier('attack', 'Gozreh Sickness', -1, 'status');
                    await token.actor.addCustomModifier('damage', 'Gozreh Sickness', -1, 'status');
                    await actor.addCustomModifier("ac", "Gozreh Sickness", -1, "status");
                    await actor.addCustomModifier("fortitude", "Gozreh Sickness", -1, "status");

                    if (!token.data.effects.includes("systems/pf2e/icons/spells/daze.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/spells/daze.jpg")
                    }

                    messageContent = 'Is Sickened by Gozreh!'
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