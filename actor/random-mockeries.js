// Courtesy of @Zarek
// Selected target receives a random mockery from a table called "Mockeries" along with the DC and damage.

// Setup variables
let tableName = "Mockeries";
let table = game.tables.entities.find(t => t.name == tableName);
let mockery = '';
// Roll the result, and mark it drawn
if (table)
{
  let result = table.roll()[1];
  if (result === null)
  {
    table.reset();
    result = table.roll()[1];
  }
  mockery = result.text;
  markDrawn(table, result);
}

function markDrawn(table, result){
  for (let data of table.data.results){
    if (result._id == data._id)
    {
      //console.log(result.text)
      data.drawn = true;
    }
  }  
}

// Get Targets name
const targetId = game.user.targets.ids[0];
const targetToken = canvas.tokens.get(targetId);
const targetName = targetToken.name;

// Add a message with damage roll
let messageContent = '';
let result = new Roll(`1d4`).roll().total;
messageContent += `${targetName} Roll WIS save DC 14 or take <b>${result}</b> damage.<br>`
messageContent += `Cas exclaims <b><i>"${mockery}"</i></b>`

// create the message
if(messageContent !== '') {
  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: messageContent,
  };
  ChatMessage.create(chatData, {});
  //console.log(messageContent)