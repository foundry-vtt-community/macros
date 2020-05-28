// pull each player's passive perception then whisper the GM with the results.
// author @Erogroth#7134

let actors = game.actors.entities.filter(e=> e.data.type==='character');

// pull each player's passive perception
let messageContent = '';
let messageHeader = '<b>Passive Perception</b><br>';
for(let actor of actors) {
  let pp = actor.data.data.skills.prc.passive; // this gives the passive perception
   messageContent += `${actor.name} <b>${pp}</b><br>`; // creating the output string
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
