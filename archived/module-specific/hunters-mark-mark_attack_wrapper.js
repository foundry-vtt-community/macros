//This marco is replacement for a rollItemMacro. Replace the name of the item
//you wish to use to make the attack. This macro must be used with the
//CastMark.json macro or it will just make a standard attack.

// PUT ITEM MACRO HERE between quotes ****************
const itemName = "Longbow";
// ***************************************************

//parameters

let myToken = token;
const macroName = "world";
const markDmg = " + 1d6";
const target = game.user.targets.values().next().value;
const bonuses = myToken.actor.data.data.bonuses;
const actorId = myToken.actor._id + "_mark";

//Check to see if the mark flag is set else make attack

function checkMark() {
  const flag = myToken.getFlag(macroName, actorId);

  if (flag) {
    if (flag.targetId == target.data._id) {
      markAttack(flag);
    } else {
      baseAttack(flag);
    }
  } else {
    game.dnd5e.rollItemMacro(itemName);
  }
}

//check if the mark damag is set and if not increase
//increase global damage by 1d6

function markAttack(flag) {
  if (!flag.isSet) {
    let obj = {
      "data.bonuses.mwak.damage": flag.meleeAtk + markDmg,
      "data.bonuses.rwak.damage": flag.rangeAtk + markDmg,
      "data.bonuses.msak.damage": flag.meleeSpell + markDmg,
      "data.bonuses.rsak.damage": flag.rangeSpell + markDmg
    };
    updateActor(myToken, obj);
    flag.isSet = true;
  }
  game.dnd5e.rollItemMacro(itemName);
  token.setFlag(macroName, actorId, flag);
}

// check if the mark damage is set and if it is revert to base global damage

function baseAttack(flag) {
  if (flag) {
    let obj = {
      "data.bonuses.mwak.damage": flag.meleeAtk,
      "data.bonuses.rwak.damage": flag.rangeAtk,
      "data.bonuses.msak.damage": flag.meleeSpell,
      "data.bonuses.rsak.damage": flag.rangeSpell
    };
    updateActor(myToken, obj);
    flag.isSet = false;
    game.dnd5e.rollItemMacro(itemName);
    token.setFlag(macroName, actorId, flag);
  } else {
    game.dnd5e.rollItemMacro(itemName);
  }
}

async function updateActor(updateToken, obj) {
  await updateToken.actor.update(obj);
}

//Ensure target is set and then call check mark function

if (!myToken) ui.notifications.error("Please select your token first.");
else {
  checkMark();
}
