(async () => {
    if (actor) {
        for ( let token of canvas.tokens.controlled ) {
            let messageContent = '';
                if ((token.actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Terrifying Resistance')) {
                    await token.actor.removeCustomModifier('attack', 'Terrifying Resistance');

                    await actor.removeCustomModifier("fortitude", "Terrifying Resistance");
                    await actor.removeCustomModifier("reflex", "Terrifying Resistance");
                    await actor.removeCustomModifier("will", "Terrifying Resistance");

                    if (token.data.effects.includes("systems/pf2e/icons/spells/dominate.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/spells/dominate.jpg")
                    }

                    messageContent = 'The terrifying aura begins to fade...'
                    
                } else {
                    await token.actor.addCustomModifier('attack', 'Terrifying Resistance', 0, 'status');

                    await actor.addCustomModifier("fortitude", "Terrifying Resistance", +1, "status");
                    await actor.addCustomModifier("reflex", "Terrifying Resistance", +1, "status");
                    await actor.addCustomModifier("will", "Terrifying Resistance", +1, "status");

                    if (!token.data.effects.includes("systems/pf2e/icons/spells/dominate.jpg")) {
                        await token.toggleEffect("systems/pf2e/icons/spells/dominate.jpg")
                    }

                    messageContent = 'Your presence eminates an aura of terror!'
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