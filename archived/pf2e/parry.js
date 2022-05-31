(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Parry"
        )
      ) {
        await actor.removeCustomModifier("ac", "Parry");
        if (
          token.data.effects.includes(
            "systems/pf2e/icons/equipment/weapons/main-gauche.png"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/equipment/weapons/main-gauche.png");
        }
      } else {
                await actor.addCustomModifier("ac", "Parry", 1, "circumstance");
        if (
          !token.data.effects.includes(
            "systems/pf2e/icons/spells/shield.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/equipment/weapons/main-gauche.png");
        }
      }
    }
  } else {
    ui.notifications.warn("You must have an actor selected.");
  }
})();