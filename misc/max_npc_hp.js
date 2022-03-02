// A simple macro for maximizing NPC HP

// Choose one of the following to update by uncommenting one of the two lines below
//const actors = game.actors; // update all actors in the sidebar
const actors = canvas.tokens.controlled.map((t) => t.actor); // update all selected tokens

actors
  .filter((actor) => actor.type === "npc")
  .forEach(async (actor) => {
    const formula = actor.data.data?.attributes?.hp?.formula;
    if (!formula) return;

    const roll = await new Roll(formula).roll({ maximize: true });
    const data = {
      "data.attributes.hp.value": roll.total,
      "data.attributes.hp.max": roll.total,
    };
    await actor.update(data);
  });
