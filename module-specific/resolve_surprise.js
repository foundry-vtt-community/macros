// Resolve who is surprised between groups of players and enemies or individual players and enemies
// This macro requires The Furnance module with "Advanced Macros" turned on.
// ReadMe: https://gitlab.com/x.technocat/foundry-macros/-/blob/e67f9441b2d6d442258db1d51aa2be3ead97569d/surprise-macros/README.md

// Get player character tokens
const playerActors = getPlayerActors();

// Get hostile tokens
const enemyActors = getEnemyActors();

let warnMsg = "";

// Main function
const isSuccessful = checkSurprise(playerActors, enemyActors);

if (!isSuccessful) {
  return ui.notifications.warn(warnMsg);
}

async function checkSurprise(playerActors, enemyActors) {
  if (!game.user.isGM) {
    warnMsg = "You do not have permission to run this macro.";
    return false;
  }
  if (!playerActors.length > 0) {
    warnMsg =
      "Could not find player characters in the scene. Please add player characters to the scene.";
    return false;
  }
  if (!enemyActors.length > 0) {
    warnMsg =
      "Could not find hostile tokens. You need tokens with hostile dispositions in the scene to check for Surprise!";
    return false;
  }

  // Displays a popup and handles the input. Thanks to PaperPunk for this.
  let calculateSurprise = false;

  new Dialog({
    title: `What Group is Sneaking?`,
    content: `
    <form>
      <div>
        <label>Select which group is sneaking/ambushing:</label><br><br>
        <div style="margin:auto; width: 50%;">
        <input type="radio" name="sneaking-group" id="enemies" value="enemies" checked="checked">
        <label for="enemies"><b>Enemy</b> is sneaking</label><br>
        <input type="radio" name="sneaking-group" id="party" value="party">
        <label for="party"><b>Party</b> is sneaking</label><br>
        </div>
        <br>
      </div>
    </form>
    `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Calculate Surprise`,
        callback: () => (calculateSurprise = true), //if "yes" is selected, apply the selection.
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel Surprise`,
      },
    },
    // Defaulting to yes, so that when someone selects something and hits enter, it doesn't cancel:
    default: "yes",

    // Handle the input
    close: (html) => {
      if (calculateSurprise) {
        // Determine which group is sneaking based on the user's selection
        const sneakyOptions = html.find('[name="sneaking-group"]');
        let sneakingGroup;
        for (const option of sneakyOptions) {
          if (option.checked) {
            sneakingGroup = option.value;
            break;
          }
        }

        let results = ``;
        let lowestStealthCheck = 0;

        switch (sneakingGroup) {
          case "enemies":
            lowestStealthCheck = rollStealth(enemyActors);
            results = calculateSurpriseResults(
              lowestStealthCheck,
              playerActors
            );
            break;

          case "party":
            lowestStealthCheck = rollStealth(playerActors);
            results = calculateSurpriseResults(
              lowestStealthCheck,
              enemyActors);
            break;
        }

        handleChatMessage(results, lowestStealthCheck);
      }
    },
  }).render(true); // display pop up window

  return true; // no issues and we're done here!
}

async function handleChatMessage(results, lowestStealth) {
  let messageContent = ``;
  let rendered = await lowestStealth.render();
  messageContent += `<b>Lowest Stealth: </b> ${rendered} <br><br>`;
  messageContent += results;

  const surpriseRules =
    "<br><b>Surprise Rules</b><br>" +
    "Compare the Dexterity (Stealth) checks of anyone hiding with the passive Wisdom (Perception) score of each creature on the opposing side. Any character or monster that doesn't notice <i><b>a</b></i> threat is surprised at the start of the encounter. <br><br>" +
    "If you're surprised, you can't move or take an action on your first turn of the combat, and you can't take a reaction until that turn ends. A member of a group can be surprised even if the other members aren't.<br><br> <i>PHB. 189</i>";

  messageContent += surpriseRules;

  let chatData = {
    user: game.user._id,
    content: messageContent,
    whisper: ChatMessage.getWhisperRecipients("GM")
  };

  ChatMessage.create(chatData, {});
}

function getPlayerActors() {
  // Get tokens in the scene that are player characters and not NPCs. Prioritize selected tokens.
  const controlledPlayerActors = canvas.tokens.controlled
    .filter((pc) => pc.actor.isPC && pc.actor.data.type === "character")
    .map((a) => a.actor);

  if (controlledPlayerActors.length > 0) {
    return controlledPlayerActors;
  }

  // If none are selected, use all the player characters in the scene
  return canvas.tokens.children[0].children
    .filter((pc) => pc.actor.isPC && pc.actor.data.type === "character")
    .map((a) => a.actor);
}

function getEnemyActors() {
  // Prioritize selected hostile enemies
  const controlledEnemyActors = canvas.tokens.controlled
    .filter((ec) => ec.actor.isPC === false && ec.data.disposition === -1)
    .map((a) => a.actor);

  if (controlledEnemyActors.length > 0) {
    return controlledEnemyActors;
  }

  // If none are selected, use all the enemies in the scene that are hostile
  return canvas.tokens.children[0].children
    .filter((ec) => ec.actor.isPC === false && ec.data.disposition === -1)
    .map((a) => a.actor);
}

function rollStealth(sneakyGroup) {
  // Roll stealth for the sneaking group
  let stealthResults = [];
  for (let actor of sneakyGroup) {
    let stealth =
      new Roll("1d20 + @steMod", { steMod: actor.data.data.skills.ste.total }).roll();
    stealthResults.push(stealth);
  }

  // Return the lowest stealth roll, it's all we need
  let lowest = stealthResults[0];
  for (let roll of stealthResults) {
    if (roll.total < lowest.total) {
      lowest = roll;
    }
  }
  return lowest;
}

function calculateSurpriseResults(lowestStealth, perceptiveGroup) {
  let resultMsg = ``;

  const surprisedTxt = `[<span style="color:red">Surprised</span>]`;
  const notSurprisedTxt = `[<span style="color:green">Not Surprised</span>]`;
  const alertTxt = `<i>Alert</i>`;

  const lowestPerception = Math.min.apply(
    Math,
    perceptiveGroup.map(function (actor) {
      return actor.data.data.skills.prc.passive;
    })
  );

  if (lowestPerception >= lowestStealth) {
    resultMsg += `<i>No one is Surprised!</i> <br>`;
  } else {
    for (let actor of perceptiveGroup) {
      const name = actor.data.name;
      const prc = actor.data.data.skills.prc.passive;
      let msg = ``;

      // If Alert feat not surprised, else if win perception not surprised, else surprised
      const alertFeat = actor.data.items.find((p) => p.name === "Alert");
      if (alertFeat) {
        msg = `${name} (${prc}) -- ${notSurprisedTxt} ${alertTxt}`;
      } else if (prc >= lowestStealth) {
        msg = `${name} (${prc}) -- ${notSurprisedTxt}`;
      } else {
        msg = `${name} (${prc}) -- ${surprisedTxt}`;
      }

      // Append this actor's surprise result to chat message variable.
      resultMsg += `${msg} <div style="border-bottom: 1px solid gray"></div> <br>`;
    }
  }

  return resultMsg;
}
