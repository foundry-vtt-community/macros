let rollBombDmg = (bomb, dmgRollType, stickyBombUsed, isCritical) => {
  let bonuses = {
  }
  let rollString;
  let chatMsg;
  if (isCritical) chatMsg = `<b>Critical Damage Roll: ${bomb.name}</b>`;
  else chatMsg = `<b> Damage Roll: ${bomb.name}</b>`;
  chatMsg = `${chatMsg}
    <div>
      <span style = "white-space:nowrap; margin: 0 2px 2px 0; padding: 0 3px; font-size: 10px; line-height: 16px; border: 1px solid #999; border-radius: 3px; color: white; background:var(--secondary);">
        ${bomb.type}
      </span>
      <span style = "white-space:nowrap; margin: 0 2px 2px 0; padding: 0 3px; font-size: 10px; line-height: 16px; border: 1px solid #999; border-radius: 3px; color: white; background: rgba(0, 0, 0, 0.45);">
        ${dmgRollType}
      </span>
    `;

  let optainedFeats = checkFeats();

  switch (dmgRollType) {
    case 'Base':
      rollString = bomb.base;
      if(bomb.condition){
        chatMsg = `
          ${chatMsg}
          <span style = "white-space:nowrap; margin: 0 2px 2px 0; padding: 0 3px; font-size: 10px; line-height: 16px; border: 1px solid #999; border-radius: 3px; color: white; background: rgba(0, 0, 0, 0.25);">
            ${bomb.condition}
          </span>
          </div>
        `;
      } else {chatMsg = `${chatMsg} </div>`};
      break;

    case 'Persistent':
      // Check for Alchemist Feat Sticky Bomb and if prerequisites are met (Quick Alchemy used and bomb level is atleast 2 lower than alchemy level)
      if (optainedFeats.includes('Sticky Bomb') && stickyBombUsed){
        let stickydmg = bomb.splash;
        // check for Alchemist Feat "Calculated Splash"
        if (optainedFeats.includes('Calculated Splash')) {
          // Splash damage of bombs equals int modifier
          stickydmg = `${actor.data.data.abilities.int.mod}`;
          if (optainedFeats.includes('Expanded Splash')) stickydmg = parseInt(bomb.splash) + actor.data.data.abilities.int.mod;
        }
        bonuses = {...bonuses, sticky: stickydmg};
        rollString = `${bomb.persistent} + @sticky`;
        chatMsg = `
          ${chatMsg}
          <span style = "white-space:nowrap; margin: 0 2px 2px 0; padding: 0 3px; font-size: 10px; line-height: 16px; border: 1px solid #999; border-radius: 3px; color: white; background: rgba(0, 0, 0, 0.25);">
            Sticky
          </span>
          </div>
        `;
      } else {
        rollString = bomb.persistent;
        chatMsg = `${chatMsg} </div>`;
      }
      if (stickyBombUsed && !optainedFeats.includes('Sticky Bomb')) ui.notifications.warn('You don\'t have the Feat "Sticky Bomb"!');
      break;

    case 'Splash':
      // check for Alchemist Feat "Calculated Splash"
      if (optainedFeats.includes('Calculated Splash')) {
        // Splash damage of bombs equals int modifier
        rollString = `${actor.data.data.abilities.int.mod}`;
        //rollString = '6';
        if (optainedFeats.includes('Expanded Splash')){
          let splashdmg = parseInt(bomb.splash) + actor.data.data.abilities.int.mod
          rollString = `${splashdmg}`;
        }
      } else {
        rollString = bomb.splash;
      }
      chatMsg = `${chatMsg} </div>`;
      break;
    default:
  }

  // Goblin Feat "Burn It!"
  if (bomb.type === 'Fire' && optainedFeats.includes('Burn It!')) {
    // + floor(itemlvl/4) to all damage types
    let damageBonus = Math.max(Math.floor(bomb.level/4), 1);
    if (!bonuses.status) {
      bonuses = {...bonuses, status: damageBonus};
      rollString = rollString + ' + @status';
    } else if (bonuses.status < damageBonus) {
      bonuses.status = damageBonus;
    }
  }


  // simulate the roll with all aplicable boni


  if(isCritical && (dmgRollType === 'Base' || dmgRollType === 'Persistent')){
    rollString = `${rollString} + ${rollString}`;
  }
  let roll = new Roll(rollString, bonuses);
  roll.roll();

  let chatData = {
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    flavor: chatMsg,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll,
  };
  ChatMessage.create(chatData, {});

}

let checkFeats = () => {
  // look up, if the character has specific feats
  let featsToLookUp = ['Burn It!', 'Calculated Splash', 'Expanded Splash', 'Sticky Bomb'];
  let optainedFeats = [];

  // checks for every item in featsToLookUp if the selected Actor has this feat and if so, pushes the item to optainedFeats
  featsToLookUp.forEach(
    (item, index) => {
      if (actor.items.find(i => i.name === item) != null) {
        optainedFeats.push(item);
      }
    }
  );
  return optainedFeats;
}

let getBombInfo = (selectedBomb, selectedQuality) => {
  // default values for bombs.
  let bombName;
  let bombPersistent, bombSplashDmg, bombBaseDmg, dmgType;
  let condition, level;

  if (selectedQuality) bombName = `${selectedBomb} (${selectedQuality})`;
  else bombName = `${selectedBomb}`;

  // sets the default item level depending on the quality of the bomb
  // lesser = 1, moderate = 3, greater = 11, major = 17
  // bombs that differ from these values need those values set in the cases
  switch (selectedQuality) {
    case 'Lesser':
      level = 1;
      break;
    case 'Moderate':
      level = 3;
      break;
    case 'Greater':
      level = 11;
      break;
    case 'Major':
      level = 17;
      break;
    default:
  }

  // change the vars according to the selected bomb
  // template for new bomb:
  // case 'bombName':
  //  switch (selectedQuality) {
  //    case 'Lesser':
  //    break;
  //    case 'Moderate':
  //    break;
  //    case 'Greater':
  //    break;
  //    case 'Major':
  //    break;
  //    default:
  //  }
  // break;
  switch (selectedBomb) {
    // Acid Flask
    case 'Acid Flask':
      switch (selectedQuality) {
        case 'Lesser':
          bombPersistent = '1d6';
          bombSplashDmg = '1';
        break;
        case 'Moderate':
          bombPersistent = '2d6';
          bombSplashDmg = '2';
        break;
        case 'Greater':
          bombPersistent = '3d6';
          bombSplashDmg = '3';
        break;
        case 'Major':
          bombPersistent = '4d6';
          bombSplashDmg = '4';
        break;
        default:
          bombPersistent = '1d6';
          bombSplashDmg = '1';
      }
      // Bomb traits independent of quality
      bombBaseDmg = '1';
      dmgType = 'Acid';
    break;

    // Alchemist's Fire
    case "Alchemist\'s Fire":
      switch (selectedQuality) {
        case 'Lesser':
          bombPersistent = '1';
          bombBaseDmg = '1d8';
          bombSplashDmg = '1';
        break;
        case 'Moderate':
          bombPersistent = '2';
          bombBaseDmg = '2d8';
          bombSplashDmg = '2';
        break;
        case 'Greater':
          bombPersistent = '3';
          bombBaseDmg = '3d8';
          bombSplashDmg = '3';
        break;
        case 'Major':
          bombPersistent = '4';
          bombBaseDmg = '4d8';
          bombSplashDmg = '4';
        break;
        default:
          bombPersistent = '1';
          bombBaseDmg = '1d8';
          bombSplashDmg = '1';
      }
      // Bomb traits independent of quality
      dmgType = 'Fire';
    break;

    // Bottled Lightning
    case "Bottled Lightning":
      switch (selectedQuality) {
        case 'Lesser':
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
        break;
        case 'Moderate':
          bombBaseDmg = '2d6';
          bombSplashDmg = '2';
        break;
        case 'Greater':
          bombBaseDmg = '3d6';
          bombSplashDmg = '3';
        break;
        case 'Major':
          bombBaseDmg = '4d6';
          bombSplashDmg = '4';
        break;
        default:
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
      }
      // Bomb traits independent of quality
      dmgType = 'Electricity';
      condition = 'flat-footed';
    break;

    // Blight Bomb
    case "Blight Bomb":
      switch (selectedQuality) {
        case 'Lesser':
          bombPersistent = '1d4';
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
        break;
        case 'Moderate':
          bombPersistent = '2d4';
          bombBaseDmg = '2d6';
          bombSplashDmg = '2';
        break;
        case 'Greater':
          bombPersistent = '3d4';
          bombBaseDmg = '3d6';
          bombSplashDmg = '3';
        break;
        case 'Major':
          bombPersistent = '4d4';
          bombBaseDmg = '4d6';
          bombSplashDmg = '4';
        break;
        default:
          bombPersistent = '1d4';
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
      }
      // Bomb traits independent of quality
      dmgType = 'Poison'
    break;

    // Dread Ampoule
    case 'Dread Ampoule':
      switch (selectedQuality) {
        case 'Lesser':
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
        break;
        case 'Moderate':
          bombBaseDmg = '2d6';
          bombSplashDmg = '2';
        break;
        case 'Greater':
          bombBaseDmg = '3d6';
          bombSplashDmg = '3';
        break;
        case 'Major':
          bombBaseDmg = '4d6';
          bombSplashDmg = '4';
        break;
        default:
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
      }
      // Bomb traits independent of quality
      condition = 'frightened 1';
      dmgType = 'Mental';
    break;

    // Frost Vial
    case 'Frost Vial':
      switch (selectedQuality) {
        case 'Lesser':
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
          condition = '-5ft Speed';
        break;
        case 'Moderate':
          bombBaseDmg = '2d6';
          bombSplashDmg = '2';
          condition = '-10ft Speed';
        break;
        case 'Greater':
          bombBaseDmg = '3d6';
          bombSplashDmg = '3';
          condition = '-10ft Speed';
        break;
        case 'Major':
          bombBaseDmg = '4d6';
          bombSplashDmg = '4';
          condition = '-15ft Speed';
        break;
        default:
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
          condition = '-5ft Speed';
      }
      // Bomb traits independent of quality
      dmgType = 'Cold';
     break;

     // Ghost Charge
     case 'Ghost Charge':
      switch (selectedQuality) {
         case 'Lesser':
          bombBaseDmg = '1d8';
          bombSplashDmg = '1';
          condition = 'enfeebled 1';
         break;
         case 'Moderate':
          bombBaseDmg = '2d8';
          bombSplashDmg = '2';
          condition = 'enfeebled 1';
         break;
         case 'Greater':
          bombBaseDmg = '3d8';
          bombSplashDmg = '3';
          condition = 'enfeebled 2';
         break;
         case 'Major':
          bombBaseDmg = '4d8';
          bombSplashDmg = '4';
          condition = 'enfeebled 2';
         break;
         default:
          bombBaseDmg = '1d8';
          bombSplashDmg = '1';
          condition = 'enfeebled 1';
       }
     // Bomb traits independent of quality
     dmgType = 'Positive';
     break;

     // Peshpine Grenade
     case 'Peshpine Grenade':
      switch (selectedQuality) {
       case 'Lesser':
        bombBaseDmg = '1d6';
        bombSplashDmg = '1';
        condition = 'stupefied 1';
       break;
       case 'Moderate':
        bombBaseDmg = '2d6';
        bombSplashDmg = '2';
        condition = 'stupefied 1';
       break;
       case 'Greater':
        bombBaseDmg = '3d6';
        bombSplashDmg = '3';
        condition = 'stupefied 2';
       break;
       case 'Major':
        bombBaseDmg = '4d6';
        bombSplashDmg = '4';
        condition = 'stupefied 3';
       break;
       default:
        bombBaseDmg = '1d6';
        bombSplashDmg = '1';
        condition = 'stupefied 1';
      }
      //  Bomb traits independent of quality
      dmgType = 'Piercing';
     break;

     // Tanglefoot Bag
     // Tanglefoot Bag is unique in that it doesn't deal any damage.
     // For now that is aquired by rolling 0 dmg
     case 'Tanglefoot Bag':
      switch (selectedQuality) {
        case 'Lesser':
          condition = '-10ft Speed';
        break;
        case 'Moderate':
          condition = '-15ft Speed';
        break;
        case 'Greater':
          condition = '-15ft Speed';
        break;
        case 'Major':
          condition = '-20ft Speed';
        break;
        default:
          condition = '-10ft Speed';
      }
      // Bomb traits independent of quality
      // on crit: immobilized 1
      bombBaseDmg = '0';
     break;

     // Thunderstone
     case 'Thunderstone':
       switch (selectedQuality) {
         case 'Lesser':
          bombBaseDmg = '1d4';
          bombSplashDmg = '1';
          condition = 'Fort DC 17';
         break;
         case 'Moderate':
          bombBaseDmg = '2d4';
          bombSplashDmg = '2';
          condition = 'Fort DC 20';
         break;
         case 'Greater':
          bombBaseDmg = '3d4';
          bombSplashDmg = '3';
          condition = 'Fort DC 28';
         break;
         case 'Major':
          bombBaseDmg = '4d4';
          bombSplashDmg = '4';
          condition = 'Fort DC 38';
         break;
         default:
          bombBaseDmg = '1d4';
          bombSplashDmg = '1';
          condition = 'Fort DC 17';
      }
    // Bomb traits independent of quality
     condition = `${condition}: deafened`;
     dmgType = 'Sonic';
     break;

     // Dwarven Daisy
     case 'Dwarven Daisy':
       switch (selectedQuality) {
        case 'Lesser':
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
          condition = 'Fort DC 16';
        break;
        case 'Moderate':
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
          condition = 'Fort DC 16';
        break;
        default:
          bombBaseDmg = '1d6';
          bombSplashDmg = '1';
          condition = 'Fort DC 16';
          ui.notifications.warn('The selected Bomb isn\'t avaiable in the selected Quality. Assuming Lesser!');
      }
     // Bomb traits independent of quality
     dmgType = 'Fire';
     condition = `${condition}: dazzled 1`;
     break;

     // Crystal Shards
     case 'Crystal Shards':
       switch (selectedQuality) {
        case 'Moderate':
          bombBaseDmg = '2d4';
          bombSplashDmg = '4';
          level = 4;
        break;
        case 'Greater':
          bombBaseDmg = '3d4';
          bombSplashDmg = '5';
          level = 12;
        break;
        case 'Major':
          bombBaseDmg = '4d4';
          bombSplashDmg = '6';
          level = 18;
        break;
        default:
          bombBaseDmg = '2d4';
          bombSplashDmg = '4';
          level = 4;
          ui.notifications.warn('The selected Bomb isn\'t avaiable in the selected Quality. Assuming Moderate!');
      }
     // Bomb traits independent of quality
     condition = 'caltrops';
     dmgType = 'Piercing'
     break;

    default:
    break;
  }

  // only persistent and condition should be left undefined
  return {
    name: bombName,
    base: bombBaseDmg,
    splash: bombSplashDmg,
    type: dmgType,
    persistent: bombPersistent,
    condition: condition,
    level: level,
  };
}

let applyChanges = false;
let rollAll = false;
if (actor) {
  if(actor.data.type === 'character') {

    new Dialog({
      title: `Alchemical Bombs`,
      content: `
        <div>
          Select a Bomb and a Quality.
          </br></br>
          For Bombs that dont have different qualities only select the bomb.
        </div>
        <hr/>
        <form>
          <div class="form-group">
            <label>Bomb :</label>
            <select name="bomb-used" id="bomb-used">
              <option value="default"> Select a Bomb </option>
              <option value= full> Acid Flask </option>
              <option value= full> Alchemist\'s Fire </option>
              <option value= full> Blight Bomb </option>
              <option value= full> Bottled Lightning </option>
              <option value= no-lesser> Crystal Shards </option>
              <option value= full> Dread Ampoule </option>
              <option value= full> Frost Vial </option>
              <option value= full> Ghost Charge </option>
              <option value= full> Peshpine Grenade </option>
              <option value= full> Tanglefoot Bag </option>
              <option value= full> Thunderstone </option>
              <option value= lesser-moderate> Dwarven Daisy </option>
            </select>
          </div>
          <div class="form-group">
            <label>Quality :</label>
            <select name="bomb-quality" id="bomb-quality">
              <option value = "default"> Select a Quality </option>
              <option value = "lesser" class = "full lesser-moderate"> Lesser </option>
              <option value = "moderate" class = "full no-lesser lesser-moderate"> Moderate </option>
              <option value = "greater" class = "full no-lesser"> Greater </option>
              <option value = "major" class = "full no-lesser"> Major </option>
            </select>
          </div>
          <div class = "form-group">
            <label> Critical Hit: </label>
            <input type="checkbox" id="critical" name="critical" value="isCritical">
          </div>
          <div class = "form-group">
            <label> Sticky Bomb: </label>
            <input type="checkbox" id="stickyBomb" name="stickyBomb" value="stickyBombUsed">
          </div>
        </form>
        <hr/>
        <script>
        // change the content of the second select according to the selected Bomb
        var fruit = $("[name=bomb-quality] option").detach()
        $("[name=bomb-used]").change(function() {
          var val = $(this).val()
          $("[name=bomb-quality] option").detach()
          fruit.filter("." + val).clone().appendTo("[name=bomb-quality]")
        }).change()
        </script>
      `,
      //buttoms
      buttons: {
        yes: {
          //icon: "<i class='fas fa-check'></i>",
          label: `Roll Damage`,
          callback: () => {applyChanges = true; rollAll = true},
        },
        maybe: {
          //icon: "<i class='fas fa-times'></i>",
          label: `Roll Persistent`,
          callback: () => applyChanges = true
        },
        no: {
          //icon: "<i class='fas fa-times'></i>",
          label: `Cancel`,
          callback: () => applyChanges = false
        },
      },
      default: "no",
      // what happens when you close the dialog
      close: html => {
        if (applyChanges) {
          //for ( let token of canvas.tokens.controlled ) {
            //let selectedBomb = html.find('[name="bomb-used"]')[0].value || "none";
            let selectedBombIndex = html.find('[name="bomb-used"]')[0].options.selectedIndex;
            let bombName = html.find('[name="bomb-used"]')[0][selectedBombIndex].label || "none";



            //let selectedQuality = html.find('[name="bomb-quality"]')[0].value || "none";
            let selectedQualityIndex = html.find('[name="bomb-quality"]')[0].options.selectedIndex;
            var bombQuality = html.find('[name="bomb-quality"]')[0][selectedQualityIndex].label || "none";

            let bomb = getBombInfo(bombName, bombQuality);

          //}



          // roll all three types of dmg and output it to chat
          if (rollAll) {
            // base damage
            rollBombDmg(bomb, 'Base', stickyBomb.checked, critical.checked);
            // splash damage
            if (bomb.splash) rollBombDmg(bomb, 'Splash', stickyBomb.checked, critical.checked);
            // persistent damage, if aplicable
            if (bomb.persistent) rollBombDmg(bomb, 'Persistent', stickyBomb.checked, critical.checked);
            else if (stickyBomb.checked) {
              bomb.persistent = '0';
              rollBombDmg(bomb, 'Persistent', stickyBomb.checked, critical.checked);
            }
          // only roll the persistent dmg and output it to chat
          } else if (bomb.persistent){
            rollBombDmg(bomb, 'Persistent', stickyBomb.checked, critical.checked);
          } else ui.notifications.warn('Select a Bomb that deals persistent damage!');

        }
      }
    }).render(true);
  } else if (actor.data.type !== 'character') ui.notifications.warn("You must select a playable character!");
} else ui.notifications.warn("You must select a playable character!");;

