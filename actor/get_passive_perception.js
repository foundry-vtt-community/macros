// pull each player's passive perception then whisper the GM with the results.
// author @Erogroth#7134

let actors = game.actors.entities.filter(e=> e.data.type==='character');
let messageContent = '';
let messageHeader = '<b>Passive Perception</b><br>';
for(let actor of actors) {
  let modifier = actor.data.data.skills.prc.mod; // this is total bonus for perception (abilitie mod + proficiency)
  let result = 10 + modifier; // this gives the passive perception
  messageContent += `${actor.name} <b>${result}</b><br>`; // creating the output string
}

// create the message
if(messageContent !== '') {
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: messageHeader + messageContent,
    whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)
  };
  ChatMessage.create(chatData, {});
}
