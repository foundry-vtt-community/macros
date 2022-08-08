(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Dueling Parry"
        )
      ) {
        await actor.removeCustomModifier("ac", "Dueling Parry");
        if (
          token.data.effects.includes(
            "https://i.imgur.com/QeRgfwS.png"
          )
        ) {
          token.toggleEffect("https://i.imgur.com/QeRgfwS.png");
        }
      } else {
        await actor.addCustomModifier("ac", "Dueling Parry", +1, "untyped");
        if (
          !token.data.effects.includes(
            "https://i.imgur.com/QeRgfwS.png"
          )
        ) {
          token.toggleEffect("https://i.imgur.com/QeRgfwS.png");
        }
      }
    }
  } else {
    ui.notifications.warn("You must have an actor selected.");
  }
})();