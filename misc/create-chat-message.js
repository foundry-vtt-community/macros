// Courtesy of @errational
// Creates a chat message.
const content = `<p>Monster attacks ${controlledToken.name}</p>`;

ChatMessage.create({
  speaker: ChatMessage.getSpeaker(controlledToken),
  content: content,
  type: CONST.CHAT_MESSAGE_TYPES.OTHER
});