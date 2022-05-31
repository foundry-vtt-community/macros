// setting variables
const tableName = "Wandering Monsters";
const msgContent = "Wandering Monster roll was: ";

// roll to check for wandering monster
const result = (await new Roll(`1d20`).roll()).total;

// create the message
const chatData = {
  content: msgContent + result,
  whisper: game.users.filter(u => u.isGM).map((u) => u.id),
};
ChatMessage.create(chatData);

// In this example, a roll between 17-20 will generate a roll from the Table. Tweak as needed!
if (result >= 17) {
  const table = game.tables.getName(tableName);
  table.draw();
}
