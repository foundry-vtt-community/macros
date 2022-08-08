(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Embers Stance"
        )
      ) {
        await actor.removeCustomModifier("ac", "Embers Stance");
        if (
          token.data.effects.includes(
            "systems/pf2e/icons/spells/fire-shield.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/spells/fire-shield.jpg");
        }
      } else {
                await actor.addCustomModifier("ac", "Embers Stance", 1, "status");
        if (
          !token.data.effects.includes(
            "systems/pf2e/icons/spells/fire-shield.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/spells/fire-shield.jpg");
        }
      }
    }
  } else {
    ui.notifications.warn("You must have an actor selected.");
  }
})();