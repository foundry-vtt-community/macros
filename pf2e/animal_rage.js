(async () => {
    if (actor) {
    for (let token of canvas.tokens.controlled) {
      if (
        (token.actor.data.data.customModifiers["ac"] || []).some(
          (modifier) => modifier.name === "Animal Rage"
        )
      ) {
        await actor.removeCustomModifier("ac", "Animal Rage");
        /// Remove the line below if you do not wish for your character to lose all temp hp when toggled "off".
        await actor.update({ "data.attributes.hp.temp": 0 });
        /// Remove the line above if you do not wish for your character to lose all temp hp when toggled "off".
        if (
          token.data.effects.includes(
            "systems/pf2e/icons/features/classes/rage.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/features/classes/rage.jpg");
        }
      } else {
        const tmpHP =
          token.actor.data.data.details.level.value +
          token.actor.data.data.abilities.con.mod;
        if (token.actor.data.data.attributes.hp.temp < tmpHP) {
          await actor.update({ "data.attributes.hp.temp": tmpHP });
        }
        await actor.addCustomModifier("ac", "Animal Rage", -1, "untyped");
        if (
          !token.data.effects.includes(
            "systems/pf2e/icons/features/classes/rage.jpg"
          )
        ) {
          token.toggleEffect("systems/pf2e/icons/features/classes/rage.jpg");
        }
      }
    }
  } else {
    ui.notifications.warn("You must have an actor selected.");
  }
})();