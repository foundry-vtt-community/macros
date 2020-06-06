const tokens = canvas.tokens.controlled;
const caster = tokens[0];

if (tokens.length !== 1) {
  ui.notifications.warn("Please select a token");
} else {
  const knowledgeTypes = [
    "Arcana",
    "Dungeoneering",
    "Engineering",
    "Geography",
    "History",
    "Local",
    "Nature",
    "Nobility",
    "Planes",
    "Religion",
  ];

  const knowledgeData = [];
  knowledgeTypes.forEach((type) => {
    const knowledgeDatum =
      caster.actor.data.data.skills[`k${type.toLowerCase().substring(0, 2)}`];
    knowledgeDatum.name = type;
    knowledgeData.push(knowledgeDatum);
  });

  const knownKnowledge = knowledgeData.filter((datum) => datum.rank > 0);

  if (knownKnowledge.length < 1) {
    ui.notifications.warn("You know nothing.");
  } else {
    const buttons = {};
    knownKnowledge.forEach((type) => {
      buttons[type.name] = {
        label: type.name,
        callback: () => {
          rollCheck(type.name, type.mod);
        },
      };
    });

    new Dialog({
      title: "Roll Knowledge!",
      content: `<p>Choose a knowledge skill</p>`,
      buttons: buttons,
    }).render(true);
  }
}

function rollCheck(name, mod) {
  const roll = new Roll(`1d20 + ${mod}`);
  roll.roll();
  roll.toMessage({
    flavor: `Knowledge ${name} check`,
    speaker: { alias: token.actor.data.name },
  });
}
