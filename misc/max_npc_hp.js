// A simple macro for maximizing NPC HP

const regEx = /(\d+d\d+)/;

// Choose one of the following to update by uncommenting one of the two lines below
//const actors = game.actors; // update all actors in the sidebar
const actors = canvas.tokens.controlled.map((t) => t.actor); // update all selected tokens

actors
  .filter((actor) => actor.type === "npc")
  .forEach(async (actor) => {
    const formula = actor.data.data?.attributes?.hp?.formula;
    if (!formula) return;

    const match = formula.match(regEx);
    if (!match) return;

    const maxDice = "(" + match[0].replace("d", "*") + ")";
    const maxFormula = formula.replace(match[0], maxDice);
    const maxHp = eval(maxFormula);

    const data = {
      "data.attributes.hp.value": maxHp,
      "data.attributes.hp.max": maxHp,
    };
    await actor.update(data);
  });
