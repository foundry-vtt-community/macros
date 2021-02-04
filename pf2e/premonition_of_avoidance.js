(async () => {
    if (actor) {
        for ( let token of canvas.tokens.controlled ) {
            let messageContent = '';
                if ((token.actor.data.data.customModifiers['attack'] || []).some(modifier => modifier.name === 'Premonition Of Avoidance')) {
                    await token.actor.removeCustomModifier('attack', 'Premonition Of Avoidance');

                    await actor.removeCustomModifier("fortitude", "Premonition Of Avoidance");
                    await actor.removeCustomModifier("reflex", "Premonition Of Avoidance");
                    await actor.removeCustomModifier("will", "Premonition Of Avoidance");

                    if (token.data.effects.includes("https://assets.forge-vtt.com/bazaar/systems/pf2e/assets/icons/equipment/adventuring-gear/hourglass.jpg")) {
                        await token.toggleEffect("https://assets.forge-vtt.com/bazaar/systems/pf2e/assets/icons/equipment/adventuring-gear/hourglass.jpg")
                    }

                    messageContent = 'The blessing from Pharasma begins to fade...'
                    
                } else {
                    await token.actor.addCustomModifier('attack', 'Premonition Of Avoidance', 0, 'status');

                    await actor.addCustomModifier("fortitude", "Premonition Of Avoidance", +2, "status");
                    await actor.addCustomModifier("reflex", "Premonition Of Avoidance", +2, "status");
                    await actor.addCustomModifier("will", "Premonition Of Avoidance", +2, "status");

                    if (!token.data.effects.includes("https://assets.forge-vtt.com/bazaar/systems/pf2e/assets/icons/equipment/adventuring-gear/hourglass.jpg")) {
                        await token.toggleEffect("https://assets.forge-vtt.com/bazaar/systems/pf2e/assets/icons/equipment/adventuring-gear/hourglass.jpg")
                    }

                    messageContent = 'Pharasma attempts to grant Bhelroth foresight!'
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