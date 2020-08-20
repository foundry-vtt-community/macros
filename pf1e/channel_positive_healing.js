// CONFIGURATION
// Leave casterName as null to channel positive as the currently-selected character
// Example `const casterName = "Bob Bobbington";`
const casterName = null;

const tokens = canvas.tokens.controlled;
let caster = tokens.map((o) => o.actor)[0];
if (!caster && !!casterName) {
    caster = game.actors.entities.filter((o) => o.name.includes(casterName))[0];
}

function channelPositive() {
  if (!caster.data.data.classes.cleric) {
    ui.notifications.warn("You're not a cleric!");
    return;
  }
  const clericLevel = caster.data.data.classes.cleric.level;
  const rollString = `${Math.floor((clericLevel + 1) / 2)}d6`;

  const roll = new Roll(rollString);
  roll.roll();
  roll.toMessage({
    flavor: "Channeling positive energy",
  });
}

if (!caster || caster === undefined) {
  ui.notifications.warn("You need to be controlling someone to channel!")
} else {
  channelPositive();
}