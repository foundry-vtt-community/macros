(async () => {
let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Crafting Results",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
    
}


const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);

let rollCrafting = (args) => {
    let {itmLevel, cra, charLevel, itmType, itmValue, charName, devinSight} = args;

    var roll = new Roll(`d20`).roll().total;
    var roll2 = new Roll(`d20`).roll().total;

    if (devinSight){
      console.log("Devin's Sight (Before) | Used roll :" + roll + ", Annex roll  :" +roll2);

      if (roll2 > roll) {
        roll = roll2;
     }

       console.log("Devin's Sight (After) | Used roll :" + roll + ", Annex roll  :" +roll2);
    }  

    var crit = handleCrits(roll);


    var DC = 0, taskLevel = charLevel, gp = 0;

    switch (itmLevel) {
      case 1:
        DC = 15;
        break;
      case 2:
        DC = 16;
        break;
      case 3:
        DC = 18;
        break;
      case 4:
        DC = 19;
        break;
      case 5:
        DC =20;
        break;
      case 6:
        DC = 22;
        break;
      case 7:
        DC = 23;
        break;
      case 8:
        DC = 24;
        break;
      case 9:
        DC = 26;
        break;
      case 10:
        DC= 27;
        break;
      case 11:
        DC = 28;
        break;
      case 12:
        DC = 30;
        break;
      case 13:
        DC = 31;
        break;
      case 14:
        DC = 32;
        break;
      case 15:
        DC = 34;
        break;
      case 16:
        DC = 35;
        break;
      case 17:
        DC = 36;
        break;
      case 18:
        DC = 38;
        break;
      case 19:
        DC = 39;
        break;
      case 20:
        DC = 40;
        break;
      default:
        DC = 14;
        break;

    }


    if (roll + crit + cra.value >= DC+10) taskLevel++;

    if (cra.rank === 4) {
      switch (taskLevel) {
        case 1:
          gp = 0.2;
          break;
        case 2:
          gp = 0.3;
          break;
        case 3:
          gp = 0.5;
          break;
        case 4:
          gp = 0.8;
          break;
        case 5:
          gp = 1;
          break;
        case 6:
          gp = 2;
          break;
        case 7:
          gp = 2.5;
          break;
        case 8:
          gp = 3;
          break;
        case 9:
          gp = 4;
          break;
        case 10:
          gp= 6;
          break;
        case 11:
          gp = 8;
          break;
        case 12:
          gp = 10;
          break;
        case 13:
          gp = 15;
          break;
        case 14:
          gp = 20;
          break;
        case 15:
          gp = 28;
          break;
        case 16:
          gp = 40;
          break;
        case 17:
          gp = 55;
          break;
        case 18:
          gp = 90;
          break;
        case 19:
          gp = 130;
          break;
        case 20:
          gp = 200;
          break;
        case 21:
          gp = 300;
          break;
        default:
          gp = 0.05;
          break;
      }
    } else if (cra.rank === 3) {
        switch (taskLevel) {
          case 1:
            gp = 0.2;
            break;
          case 2:
            gp = 0.3;
            break;
          case 3:
            gp = 0.5;
            break;
          case 4:
            gp = 0.8;
            break;
          case 5:
            gp = 1;
            break;
          case 6:
            gp = 2;
            break;
          case 7:
            gp = 2.5;
            break;
          case 8:
            gp = 3;
            break;
          case 9:
            gp = 4;
            break;
          case 10:
            gp= 6;
            break;
          case 11:
            gp = 8;
            break;
          case 12:
            gp = 10;
            break;
          case 13:
            gp = 15;
            break;
          case 14:
            gp = 20;
            break;
          case 15:
            gp = 28;
            break;
          case 16:
            gp = 36;
            break;
          case 17:
            gp = 45;
            break;
          case 18:
            gp = 70;
            break;
          case 19:
            gp = 100;
            break;
          case 20:
            gp = 150;
            break;
          case 21:
            gp = 175;
            break;
          default:
            gp = 0.05;
            break;
        }

    } else if (cra.rank === 2) {
        switch (taskLevel) {
          case 1:
            gp = 0.2;
            break;
          case 2:
            gp = 0.3;
            break;
          case 3:
            gp = 0.5;
            break;
          case 4:
            gp = 0.8;
            break;
          case 5:
            gp = 1;
            break;
          case 6:
            gp = 2;
            break;
          case 7:
            gp = 2.5;
            break;
          case 8:
            gp = 3;
            break;
          case 9:
            gp = 4;
            break;
          case 10:
            gp= 5;
            break;
          case 11:
            gp = 6;
            break;
          case 12:
            gp = 8;
            break;
          case 13:
            gp = 10;
            break;
          case 14:
            gp = 15;
            break;
          case 15:
            gp = 20;
            break;
          case 16:
            gp = 25;
            break;
          case 17:
            gp = 30;
            break;
          case 18:
            gp = 45;
            break;
          case 19:
            gp = 60;
            break;
          case 20:
            gp = 75;
            break;
          case 21:
            gp = 90;
            break;
          default:
            gp = 0.05;
            break;
        }

    } else if (cra.rank === 1){
         switch (taskLevel) {
          case 1:
            gp = 0.2;
            break;
          case 2:
            gp = 0.3;
            break;
          case 3:
            gp = 0.5;
            break;
          case 4:
            gp = 0.7;
            break;
          case 5:
            gp = 0.9;
            break;
          case 6:
            gp = 1.5;
            break;
          case 7:
            gp = 2;
            break;
          case 8:
            gp = 2.5;
            break;
          case 9:
            gp = 3;
            break;
          case 10:
            gp= 4;
            break;
          case 11:
            gp = 5;
            break;
          case 12:
            gp = 6;
            break;
          case 13:
            gp = 7;
            break;
          case 14:
            gp = 8;
            break;
          case 15:
            gp = 10;
            break;
          case 16:
            gp = 13;
            break;
          case 17:
            gp = 15;
            break;
          case 18:
            gp = 20;
            break;
          case 19:
            gp = 30;
            break;
          case 20:
            gp = 40;
            break;
          case 21:
            gp = 50;
            break;
          default:
            gp = 0.05;
            break;
        }
    }

    if (itmType === "rare") DC += 5;

    let message = `Starts crafting a ${itmType} item of level ${itmLevel}, supplying ${itmValue/2}gp... [[${roll}+${cra.value}]] ! </br> </br>`;

    if (roll + crit + cra.value >= DC+10) {
        toChat(`${message} Critical success ! Each additional day spent Crafting reduces the materials needed to complete the item by an amount of ${gp}gp. </br> ${charName} can also pay ${itmValue/2}gp to finish the crafting immediately or spend ${Math.ceil((itmValue/2)/gp)} additionnal days.`);
    } else if (roll+crit + cra.value >= DC) {
        toChat(`${message} It's a success. Each additional day spent Crafting reduces the materials needed to complete the item by an amount of ${gp}gp. </br> ${charName} can also pay ${itmValue/2}gp to finish the crafting immediately or spend ${Math.ceil((itmValue/2)/gp)} additionnal days.`,);
    } else if (roll + crit + cra.value < DC-10) {
        toChat(`${message} It's a critical failure... ${charName} fails to complete the item. ${charName} loses raw materials worth ${(itmValue/2)*0.1}gp but can salvage the remaining ${(itmValue/2)*0.9}gp. ${charName} must start over if he/she wants to try again.`);
    } else if (roll+crit + cra.value < DC) {
        toChat(`${message} It's a failure. ${charName} can salvage raw materials worth ${itmValue/2}gp. ${charName} must start over if he/she wants to try again.`);
    }
    
}

let applyChanges = false;
new Dialog({
  title: `Crafting`,
  content: `
    <div>Select an item you want to craft. Don't forget you need to possess the according formula in order to craft this item.<div>
    <hr/>
    <form>
      <div class="form-group">
        <label>Item level :</label>
        <input id="lvl-item" name="lvl-item" type="number"/>
      </div>
      <div class="form-group">
        <label>Item value (in GP) :</label>
        <input id="value-item" name="value-item" type="number"/>
      </div>
      <div class="form-group">
        <label>Rare item ?</label>
        <input id="rare-item" name="rare-item" type="checkbox" value="rare"/>
      </div>
      <div class="form-group">
        <label>Devin's Sight ?</label>
        <input id="fortune" name="fortune" type="checkbox" value="fortune"/>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Start crafting !`,
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
      for ( let token of canvas.tokens.controlled ) {
        var {cra} = actor.data.data.skills;
        var charLevel = actor.data.data.details.level.value;
        var charName = actor.data.name;
        let itmType = html.find('[name="rare-item"]')[0].checked ? "rare" : "common" ;
        let devinSight = html.find('[name="fortune"]')[0].checked;
        let itmLevel = parseInt(html.find('[name="lvl-item"]')[0].value) || 0;
        let itmValue = parseInt(html.find('[name="value-item"]')[0].value) || 0;

        console.log(itmType);

        if (itmLevel <= charLevel) {


          if (itmLevel >= 0 && itmLevel <= 20) {
            if (cra.rank >= 4) {
                    return rollCrafting({itmLevel, cra, charLevel, itmType, itmValue, charName, devinSight});
            } else if (cra.rank >= 3) {
                if (itmLevel < 16) {
                    return rollCrafting({itmLevel, cra, charLevel, itmType, itmValue, charName, devinSight});
              } else {
                ui.notifications.warn("Don't possess the sufficient proficiency to craft this !");
              }

            } else if (cra.rank >= 1) {
              if (itmLevel < 9) {
                    return rollCrafting({itmLevel, cra, charLevel, itmType, itmValue, charName, devinSight});
              } else {
                ui.notifications.warn("Don't possess the sufficient proficiency to craft this !");
              }
            } else {
              ui.notifications.warn("Isn't trained in Crafting, and can't craft stuff !");
            }
          } else ui.notifications.warn("Invalid item level !");
        } else ui.notifications.warn("Item level above character level !");
        return;
      }
    }
  }
}).render(true);
 })();