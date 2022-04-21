(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
         let messageContent = '';
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Blood Magic"
        )
      ) {
        await actor.removeCustomModifier("ac", "Blood Magic");      
        if (
          token.data.effects.includes(
            "https://i.imgur.com/Jtub936.png"
          )
        ) {
          token.toggleEffect("https://i.imgur.com/Jtub936.png");
        }
                    messageContent = 'The scales begin to fade away...'
      } else {        
        await actor.addCustomModifier("ac", "Blood Magic", +1, "untyped");
        if (
          !token.data.effects.includes(
            "https://i.imgur.com/Jtub936.png"
          )
        ) {
          token.toggleEffect("https://i.imgur.com/Jtub936.png");
        }
messageContent = 'Draconic scales strengthen your defenses.'
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