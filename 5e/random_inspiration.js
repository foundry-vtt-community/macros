// Courtesy of @Zarek
// Selected target receives a random inspiration from a table called "inspirations".
// You can find a table called inspirations in the community tables module

// Setup variables
let tableName = "Inspirations";

let bardicInspiration = async() => {
  if (!actor) {
    ui.notifications.warn("You must have an actor selected.");
    return
  }

  // Get Targets name
  let actorLevels = actor.data.data.levels || 1;
  const targetId = game.user.targets.ids[0];
  const targetToken = canvas.tokens.get(targetId);
  if (!targetToken) {
    ui.notifications.warn("You must target a token.");
    return
  }
  const targetName = targetToken.name;


  let table = game.tables.contents.find(t => t.name == tableName);

  //default inspiration if no table is found.
  //let inspiration = "Cowards die many times before their deaths; the valiant never taste death but once.";
  let inspiration = `I don't know what effect ${targetName} will have upon the enemy, but, by God, he terrifies me.`;
  
  // Roll the result, and mark it drawn
  if (table) {
    if (checkTable(table)) {
      // let result = table.roll()[1];
      let roll = await table.roll();
      let result = roll.results[0];
      inspiration = result.data.text;
      await table.updateEmbeddedDocuments("TableResult", [{
        _id: result.id,
        drawn: true
      }]);
    }
  }

  function checkTable(table) {
    let results = 0;
    for (let data of table.data.results) {
      if (!data.drawn) {
        results++;
      }
    }
    if (results < 1) {
      table.reset();
      ui.notifications.notify("Table Reset")
      return false
    }
    return true
  }

  let dieType = 'd6';
  if (actorLevels >= 15) {
    dieType = 'd12';
  } else if (actorLevels >= 10) {
    dieType = 'd10';
  } else if (actorLevels >= 5) {
    dieType = 'd8';
  }

  let messageContent = '';
  messageContent += `<p>${token.name} exclaims <b><i>"${inspiration}"</i></b></p>`
  messageContent += `<p>${targetName} is inspired.</p>`
  messageContent += `<details closed=""><summary><a>Bardic Inspiration</a></summary><p>${targetName} gains one Bardic Inspiration die, a <strong>${dieType}</strong>.<br>Once within the next 10 minutes, ${targetName} can roll the die and add the number rolled to one <b>ability check, attack roll, or saving throw</b>. ${targetName} can wait until after it rolls the <strong>d20</strong> before deciding to use the Bardic Inspiration die, but must decide before the DM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost.</p></details>`

  // create the message
  if (messageContent !== '') {
    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      content: messageContent,
    };
    ChatMessage.create(chatData, {});
  }
};
bardicInspiration();
