// Pull the passive perception of each token in the current scene and whisper the results to the GM.
// This has only been tested within the D&D 5e system.
// Author: @Drunemeton#7955. Based on the original macro by author @Erogroth#7134.

// Collect tokens in the scene.
let tokens = canvas.tokens.placeables.filter((token) => token.data);

// Initialize message building blocks.
let messageContent = "";
let messageHeader = "<b>Passive Perception</b><br>";

// Loop through the token array.
for (let count of tokens) {
  // Extract the passive perception value.
  let pp = count.actor.data.data.skills.prc.passive;
  if (typeof pp === "number") {
    // Create the output string.
    messageContent += `${count.name} <b>${pp}</b><br>`;
  } else {
    messageContent += `${count.name} <b>Unknown</b><br>`;
  }
}

// Create the message.
if (messageContent !== "") {
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: messageHeader + messageContent,
    whisper: game.users.entities.filter((u) => u.isGM).map((u) => u._id),
  };
  // Display message in chat.
  ChatMessage.create(chatData, {});
}
