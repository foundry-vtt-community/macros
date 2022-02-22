/**
 * Macro for the Second Wind feature of Fighter.
 * Works with an active Fighter actor, prints a ui error otherwise.
 *
 * Requires a "Second Wind" resource, and will decrement it automatically.
 * Prints a chat message, rolls the heal amount, and updates the actor sheet appropriately.
 *
 * Inspired largely by the rage macro for 5e by Norc#5108
 */

// TODO: Add additional configuration options and overrides.

let fighter = "";
let chatMsg = "";
let macroActor = actor;
let macroToken = token;

const fighterClassName = "Fighter";
const secondWindResourceName = "Second Wind";

const secondWindMessage = "takes a deep breath and heals for";

const errorSelectFighter = "Please select a single fighter token";
const errorNoSecondWind =
  "does not have any second wind left, time for a rest!";

/**
 * Optional Resource Reduction
 */
const resourceDeduction = true;
const preventNegative = true;

if (macroActor !== undefined && macroActor !== null) {
  fighter = macroActor.items.find((i) => i.name === `${fighterClassName}`);
  // Early error if not a fighter
  if (fighter === undefined) errorMsg(errorSelectFighter);

  // Logic if selected actor is a fighter
  if (fighter !== undefined && fighter !== null) {
    // Check for available second wind resource
    if (checkResource(macroActor)) {
      // Calculate string to roll based on fighter level
      let fighterLvl = fighter.data.data.levels;
      let healRoll = await new Roll(`1d10 + ${fighterLvl}`).roll();

      ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({
          token: actor,
        }),
        content: `<em>${macroActor.name} ${secondWindMessage} <strong>${healRoll.total}<strong><em>`,
      });

      updateHP(macroActor, healRoll.total);
    }
  }
}

/**
 * Updates the hp value of the actor sheet
 *
 * @param {Actor} actor active actor calling the macro
 * @param {Number} amt amount to add to current hp
 * @return {Number} actor sheet current hp value
 */
function updateHP(actor, amt) {
  let { attributes } = actor.data.data;
  let cur_hp = attributes.hp.value;
  let max_hp = attributes.hp.max;
  let min_hp = attributes.hp.min;

  cur_hp = Math.min(cur_hp + amt, max_hp);
  cur_hp = Math.max(cur_hp, min_hp);
  actor.update({
    "data.attributes.hp.value": parseInt(cur_hp),
  });
  return cur_hp;
}

/**
 * Checks the resource of the actor sheet
 *
 * @param {Actor} actor active actor calling the macro
 * @return {Boolean} true if resource available or deduction disabled, false otherwise
 */
function checkResource(actor) {
  if (resourceDeduction) {
    const { resources } = actor.data.data;
    let hasResource = false;
    let newResources = duplicate(resources);
    let obj = {};
    // Look for resources under core actor data
    let resourceKey = Object.keys(resources)
      .filter((key) => resources[key].label === `${secondWindResourceName}`)
      .shift();
    if ((resourceKey && resources[resourceKey].value > 0) || !preventNegative) {
      hasResource = true;
      newResources[resourceKey].value--;
      obj["data.resources"] = newResources;
      actor.update(obj);
      return true;
    }
    if (!hasResource) {
      ui.notifications.error(`${actor.name} ${errorNoSecondWind}`);
      return false;
    }
  }
  return true;
}
