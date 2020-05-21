// getting all actors of selected tokens
let actors = canvas.tokens.controlledTokens.map(({ actor }) => actor);

// if there are no selected tokens, roll for the player's character.
if (actors.length < 1) {
  actors = game.users.entities.map(entity => {
    if (entity.active && entity.character !== null) {
      return entity.character;
    }
  });
}

const validActors = actors.filter(actor => actor != null);

// roll for every actor
let messageContent = 'pp = passive perception<br>';


for (const selectedActor of validActors) {
  const stealthMod = selectedActor.data.data.skills.ste.mod; // stealth roll
  const stealth = new Roll(`1d20+${stealthMod}`).roll().total; // rolling the formula
  messageContent += `<hr><h3>${selectedActor.name} stealth roll was a <b>${stealth}</b>.</h3>`; // creating the output string

  // grab a list of unique tokens then check their passive perception against the rolled stealth.
  const uniqueActor = {};
  const caughtBy = canvas.tokens.placeables
    .filter(token => !!token.actor)
    .filter(({ actor }) => {
      if (uniqueActor[actor.name]) {
        return false;
      }
      uniqueActor[actor.name] = true;
      return true;
    })
    .filter(({ actor }) => {
      return selectedActor.id !== actor.id;
    })
    .filter(({ actor }) => actor.data.data.skills.prc.passive >= stealth);

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
