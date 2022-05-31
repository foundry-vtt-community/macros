let toChat = (content) => {
  let chatData = {
    user: game.user.id,
    content,
    speaker: ChatMessage.getSpeaker(),
  }
  ChatMessage.create(chatData, {})
}

const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);

let getDC = (level) => { // Création de DC en fonction du niveau
  let arrayDC = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50]
  var DC = arrayDC[level];
  return DC;
}

let valueIncome = (skillRank, taskLevel) => {
  let arrayIncome = [
    [0.01, 0.02, 0.04, 0.08, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3, 4, 6, 8, 8],
    [0.05, 0.2, 0.3, 0.5, 0.7, 0.9, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 13, 15, 20, 30, 40, 50],
    [0.05, 0.2, 0.3, 0.5, 0.8, 1, 2, 2.5, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 45, 60, 75, 90],
    [0.05, 0.2, 0.3, 0.5, 0.8, 1, 2, 2.5, 3, 4, 6, 8, 10, 15, 20, 28, 36, 45, 70, 100, 150, 175],
    [0.05, 0.2, 0.3, 0.5, 0.8, 1, 2, 2.5, 3, 4, 6, 8, 10, 15, 20, 28, 40, 55, 90, 130, 200, 300],
  ]
  var GP = arrayIncome[skillRank][taskLevel];

  return GP;
}

let rollCrafting = (args) => {
  let {
    itmLevel,
    cra,
    charLevel,
    itmType,
    itmValue,
    charName,
    devinSight
  } = args;

  var roll = new Roll(`d20`).roll().total;
  var roll2 = new Roll(`d20`).roll().total;

  if (devinSight) {
    console.log(`BM Macros | Devin's Sight (Before) | Roll: ${roll}, DS: ${roll2}`);

    if (roll2 > roll) {
      roll = roll2;
    }

    console.log(`BM Macros | Devin's Sight (After) | Roll: ${roll}, DS: ${roll2}`);
  }

  var crit = handleCrits(roll);


  var DC = getDC(itmLevel);

  if (roll + crit + cra.value >= DC + 10) charLevel++;

  var gp = valueIncome(cra.rank, charLevel);

  if (itmType === "rare") DC += 5;

  let message = `${charName} starts crafting a ${itmType} item of level ${itmLevel} by using the equivalent of ${itmValue/2}gp... [[${roll}+${cra.value}]] ! </br> </br>`;

  if (roll + crit + cra.value >= DC + 10) {
    toChat(`${message} It's a critical success! Each additional day spent Crafting reduces the materials needed to complete the item by an amount of ${gp}gp. </br> ${charName} can pay the equivalent of ${itmValue/2}gp 
    to finish the crafting instantly of spend ${Math.ceil((itmValue/2)/gp)} additionnal days to complete it for free.`);
  } else if (roll + crit + cra.value >= DC) {
    toChat(`${message} It's a success. Each additional day spent Crafting reduces the materials needed to complete the item by an amount of ${gp}gp. </br> ${charName} can pay the equivalent of ${itmValue/2}gp 
    to finish the crafting instantly of spend ${Math.ceil((itmValue/2)/gp)} additionnal days to complete it for free.`, );
  } else if (roll + crit + cra.value < DC - 10) {
    toChat(`${message} It's a critical failure. ${charName} fails to complete the item. ${charName} ruins ${((itmValue/2)*0.1).toFixed(2)}gp of the raw materials supplied, 
    but can salvage the remaining ${((itmValue/2)*0.9).toFixed(2)}gp. If ${charName} wants to try again, he/she must start over.`);
  } else if (roll + crit + cra.value < DC) {
    toChat(`${message} It's a failure. ${charName} can salvage the equivalent in raw materials of ${itmValue/2}gp. If ${charName} wants to try again, he/she must start over..`);
  }

}

let applyChanges = false;
if (actor) {
  if (actor.data.type === 'character') {
    new Dialog({
      title: `Craft Something`,
      content: `
    <div>Select the level of the item you want to craft. Don't forget you must possess the formula for it.<div>
    <hr/>
    <form>
      <div class="form-group">
        <label>Item level:</label>
        <input id="lvl-item" name="lvl-item" type="number"/>
      </div>
      <div class="form-group">
        <label>Item value (in GP):</label>
        <input id="value-item" name="value-item" type="number"/>
      </div>
      <div class="form-group">
        <label>Rare item?</label>
        <input id="rare-item" name="rare-item" type="checkbox" value="rare"/>
      </div>
      <div class="form-group">
        <label>Fortune?</label>
        <input id="fortune" name="fortune" type="checkbox" value="fortune"/>
      </div>
    </form>
    `,
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: `Start Crafting`,
          callback: () => applyChanges = true
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: `Cancel`
        },
      },
      default: "yes",
      close: html => {
        if (applyChanges) {
          for (let token of canvas.tokens.controlled) {
            var {
              cra
            } = actor.data.data.skills;
            var charLevel = actor.data.data.details.level.value;
            var charName = actor.data.name;
            let itmType = html.find('[name="rare-item"]')[0].checked ? "rare" : "commun";
            let devinSight = html.find('[name="fortune"]')[0].checked;
            let itmLevel = parseInt(html.find('[name="lvl-item"]')[0].value) || 0;
            let itmValue = parseInt(html.find('[name="value-item"]')[0].value) || 0;

            if (itmLevel <= charLevel) {

              if (itmLevel >= 0 && itmLevel <= 20) {
                if (cra.rank >= 4) {
                  return rollCrafting({
                    itmLevel,
                    cra,
                    charLevel,
                    itmType,
                    itmValue,
                    charName,
                    devinSight
                  });
                } else if (cra.rank >= 3) {
                  if (itmLevel < 16) {
                    return rollCrafting({
                      itmLevel,
                      cra,
                      charLevel,
                      itmType,
                      itmValue,
                      charName,
                      devinSight
                    });
                  } else {
                    ui.notifications.warn(`That character doesn't have the appropriate proficiency for this item!`);
                  }

                } else if (cra.rank >= 1) {
                  if (itmLevel < 9) {
                    return rollCrafting({
                      itmLevel,
                      cra,
                      charLevel,
                      itmType,
                      itmValue,
                      charName,
                      devinSight
                    });
                  } else {
                    ui.notifications.warn(`That character doesn't have the appropriate proficiency for this item!`);
                  }
                } else {
                  ui.notifications.warn(`That character isn't trained in Crafting!`);
                }
              } else ui.notifications.warn(`Invalid item level!`);
            } else ui.notifications.warn(`That character doesn't have the appropriate level for this item!`);
            return;
          }
        }
      }
    }).render(true);
  } else if (actor.data.type !== 'character') ui.notifications.warn(`You must target a PC!`);
} else;