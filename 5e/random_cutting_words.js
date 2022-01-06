// Courtesy of @Zarek
// Selected target receives a random cutting word from a table called "Mockeries" along with the roll reduction.
// You can find a mockeries table in the community table module.

let cuttingWords = async () => {
  // Setup variables
  let tableName = "mockeries";
  let mockery = "Now go away or I shall taunt you a second time-a!"; // if table can't be found, use this.

  if (!actor) {
    ui.notifications.warn("You must have an actor selected.");
    return
  }

  let actorLevels = actor.data.data.levels || 1;
  let table = game.tables.contents.find(t => t.name == tableName);
  // Get Targets name
  const targetId = game.user.targets.ids[0];
  const targetToken = canvas.tokens.get(targetId);
  if (!targetToken) {
    ui.notifications.warn("You must target a token.");
    return
  }
  const targetName = targetToken.name;

  // Roll the result, and mark it drawn
  if (table) {
    if (checkTable(table)) {
      let roll = await table.roll();
      let result = roll.results[0];
      mockery = result.data.text;
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

  let messageContent = `<p>${targetName} Reduce your roll by: <b>[[1${dieType}]]</b>.</p>`
  messageContent += `<p>${token.name} exclaims <b><i>"${mockery}"</i></b></p>`
  messageContent += `<details closed=""><summary><a>Cutting Words</a></summary>
  <p>When a creature that you can see within 60 feet of you makes an <b>Attack roll, an ability check, or a damage roll</b>, you can use your <b>Reaction</b> to expend one of your uses of <b>Bardic Inspiration</b>,
  rolling a Bardic Inspiration die and subtracting the number rolled from the creature’s roll.</p>
  <p>You can choose to use this feature after the creature makes its roll, but before the GM determines whether the Attack roll or ability check succeeds or fails, or before the creature deals its damage. 
  The creature is immune if it can’t hear you or if it’s immune to being <b>Charmed</b>.</p></details>`

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

cuttingWords();
