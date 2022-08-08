(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Dueling Cape"
        )
      ) {
        await actor.removeCustomModifier("ac", "Dueling Cape");
        if (
          token.data.effects.includes(
            "systems/pf2e/icons/equipment/adventuring-gear/dueling-cape.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/equipment/adventuring-gear/dueling-cape.jpg");
        }
      } else {
                await actor.addCustomModifier("ac", "Dueling Cape", 1, "circumstance");
        if (
          !token.data.effects.includes(
            "systems/pf2e/icons/spells/fire-shield.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/equipment/adventuring-gear/dueling-cape.jpg");
        }
      }
    }
  } else {
    ui.notifications.warn("You must have an actor selected.");
  }
})();