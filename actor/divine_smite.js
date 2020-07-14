/*
 * The Smite macro emulates the Divine Smite feature of Paladins in DnD 5e. A spell slot level to use
 * can be selected, which increases the number of damage dice, and smiting a fiend or undead
 * will also increase the number of damage dice.
 * 
 * If a token is not selected, the macro will default back to the default character for the Actor. 
 * This allows for the GM to cast the macro on behalf a character that possesses it, 
 * without requiring that a PC have their character selected.
 * To execute the macro a target MUST be specified and, unless configured otherwise, the character must have an available spell slot. 
 * Make your regular attack and then if you choose to use Divine Smite, run this macro.
 */

//Configurable variables
let maxSpellSlot = 5; //  Highest spell-slot level that may be used.
let affectedCreatureTypes = ["fiend", "undead", "undead (shapechanger)"]; //  Creature types that take extra damage.

// Use token selected, or default character for the Actor if none is.
let s_actor = canvas.tokens.controlled[0]?.actor || game.user.character;     

// Verifies if the actor can smite.
if (s_actor?.data.items.find(i => i.name === "Divine Smite") === undefined){
    return ui.notifications.error(`No valid actor selected that can use this macro.`);
}

let confirmed = false;
if (hasAvailableSlot(s_actor)) {

    // Get options for available slots
    let optionsText = "";
    for (let i = 1; i < maxSpellSlot; i++) {
        let chosenSpellSlots = getSpellSlots(s_actor, i);
        if (chosenSpellSlots.value > 0) {
            optionsText += `<option value="${i}">${i} - ${chosenSpellSlots.value} slots available</option>`;
        }
    }
	
    // Create a dialogue box to select spell slot level to use when smiting.
    new Dialog({
        title: "Divine Smite Damage",
        content: `
        <form>
        <p>Spell Slot level to use Divine Smite with.</p>
            <div class="form-group">
                <label>Spell Slot Level:</label>
                <select name="slot-level">` + optionsText + `</select>
            </div>
            <div class="form-group">
                <label>Critical Hit:</label>
                <input type="checkbox" name="criticalCheckbox">
            </div>
        </form>
        `,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "SMITE!",
                callback: () => confirmed = true
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => confirmed = false
            }
        },
        default: "Cancel",
        close: html => {
            if (confirmed) {
                let slotLevel = parseInt(html.find('[name=slot-level]')[0].value);
                let criticalHit = html.find('[name=criticalCheckbox]')[0].checked;
                smite(s_actor, slotLevel, criticalHit);
            }
        }
    }).render(true);

} else {
    return ui.notifications.error(`No spell slots available to use this feature.`);    
}

/**
 * Gives the spell slot information for a particular actor and spell slot level.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @param {integer} level - the spell slot level to get information about. level 0 is deprecated.
 * @returns {object} contains value (number of slots remaining), max, and override.
 */
function getSpellSlots(actor, level) {
    return actor.data.data.spells[`spell${level}`];
}

/**
 * Returns whether the actor has any spell slot left.
 * @param {Actor5e} actor - the actor to get slot information from.
 * @returns {boolean} True if any spell slots of any spell level are available to be used.
 */
 function hasAvailableSlot(actor) {
     for (let slot in actor.data.data.spells) {
         if (actor.data.data.spells[slot].value > 0) {
             return true;
         }
     }
     return false;
 }

/**
 * Use the controlled token to smite the targeted token.
 * @param {Actor5e} actor - the actor that is performing the action.
 * @param {integer} slotLevel - the spell slot level to use when smiting.
 * @param {boolean} criticalHit - whether the hit is a critical hit.
 */
function smite(actor, slotLevel, criticalHit) {
    let targets = game.user.targets;
    let chosenSpellSlots = getSpellSlots(actor, slotLevel);

    if (chosenSpellSlots.value < 1) {
        ui.notifications.error("No spell slots of the required level available.");
        return;
    }
    if (targets.size !== 1) {
        ui.notifications.error("You must target exactly one token to Smite.");
        return;
    }

    targets.forEach(target => {
        let numDice = slotLevel + 1;
        let type = target.actor.data.data.details.type?.toLocaleLowerCase();
        if (affectedCreatureTypes.includes(type)) numDice += 1;
        if (criticalHit) numDice *= 2;
        new Roll(`${numDice}d8`).roll().toMessage({ flavor: "Macro Divine Smite - Damage Roll (Radiant)", speaker })
    })

    let objUpdate = new Object();
    objUpdate['data.spells.spell' + slotLevel + '.value'] = chosenSpellSlots.value - 1;
    actor.update(objUpdate);
}