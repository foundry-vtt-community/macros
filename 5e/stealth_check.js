// Grabs selected tokens and rolls a stealth check against all other tokens passive perception on the map. Then returns the result.

// getting all actors of selected tokens
let actors = canvas.tokens.controlled.map(({ actor }) => actor);

// if there are no selected tokens, roll for the player's character.
if (actors.length < 1) {
  actors = game.users.entities.map(entity => {
    if (entity.active && entity.character !== null) {
      return entity.character;
    }
  });
}
const validActors = actors.filter(actor => actor != null);

let messageContent = 'pp = passive perception<br>';

// roll for every actor
for (const selectedActor of validActors) {
  const stealthMod = selectedActor.data.data.skills.ste.total; // stealth roll
  const stealth = new Roll(`1d20+${stealthMod}`).roll().total; // rolling the formula
  messageContent += `<hr><h3>${selectedActor.name} stealth roll was a <b>${stealth}</b>.</h3>`; // creating the output string

  // grab a list of unique tokens then check their passive perception against the rolled stealth.
  const uniqueActor = {};
  const caughtBy = canvas.tokens.placeables
    .filter(token => !!token.actor)
    .filter(({ actor }) => { // filter out duplicate token names. ie: we assume all goblins have the same passive perception
      if (uniqueActor[actor.name]) {
        return false;
      }
      uniqueActor[actor.name] = true;
      return true;
    })
    .filter(({ actor }) => {
      return selectedActor.id !== actor.id; // Don't check to see if the token sees himself.
    })
    .filter(({ actor }) => actor.data.data.skills.prc.passive >= stealth); // check map tokens passives with roller stealth

  if (!caughtBy.length) {
    messageContent += 'Stealth successful!<br>';
  } else {
    messageContent += 'Stealth questionable:<br>';
    caughtBy.map(({ actor }) => {
      messageContent += `<b>${actor.name}</b> pp(${actor.data.data.skills.prc.passive}).<br>`;
    });
  }
}

// create the message
const chatData = {
  user: game.user._id,
  speaker: game.user,
  content: messageContent,
  whisper: game.users.entities.filter((u) => u.isGM).map((u) => u._id),
};
ChatMessage.create(chatData, {});
