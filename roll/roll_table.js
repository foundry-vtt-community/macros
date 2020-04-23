// Simple macro example to only roll from a table and whisper the result to the DM

const table = game.tables.entities.find(t => t.name === "name of your table");
let roll = table.roll();

let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: roll[1].text,
    whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)
};
ChatMessage.create(chatData, {});