/*   This macro is meant to automate the Sacred Weapon paladin Channel Divinity feature.
*    This means that you get to decide which weapon from your inventory you want to buff.
*    The macro automatically adds your Charisma modifier to the attackBonus field of the weapon.
*    Also removes a Channel Divinity slot. If you have no slots left you can still use the macro, but it will drop an error.
*    (there is an option to not expend any slots also)
*    If the effect is already on your weapon executing the macro a second time reverts the changes to the weapon.


*    Levente Ódor 2024/11/12 (yyyy/MM/dd) v1.0
*        Discord: thecringeone
*        Github: Levente007
*    Dropped support for the old data structure. The macro now uses the new one.
*    No longer using wapgate module. The macro is now standalone.
*
*
*    Levente Ódor 2024/05/10 (yyyy/MM/dd) v0.1
*        Discord: thecringeone
*        Github: Levente007
*
*    Have fun slaying them dragons in them dungeons! 
*/

// VARIABLES
let actor = canvas.tokens.controlled[0]?.actor || game.user.character;
let cha = token.document.actor.system.abilities.cha.mod;

// ON SECOND CLICK REMOVE BUFF
if (actor?.flags.scweapon.active == true) {
    // remove buffs
    let weapon = actor?.items.get(actor?.flags.scweapon.weaponId);
    weapon.update({"system.attack.bonus": actor?.flags.scweapon.originaAtckBonus});
    if (!actor?.flags.scweapon.wasMgc) {
        let properties = weapon.system.properties;
        properties.delete('mgc');
        weapon.update({"system.properties": properties});
    }
    //remove flag
    actor?.update({'flags.scweapon': {'active': false, 'weaponId': '', 'originaAtckBonus': '', 'wasMgc': ''}});
    return;
}

//VALIDATIONS
// check if the actor has this ability or not
function find(findName, map) {
    for (let [key, value] of map) {
        if (value.name === findName && value.system.activation.type != '') { // paladin gets 2 features named 'Channel Divinity' for this reason we must find the one that has an action which is the real one
            return value;
        }
    }
    return undefined;
}
if (find("Sacred Weapon", actor?.sourcedItems.entries()) === undefined) {
    return ui.notifications.error(`No actor selected has the "Sacred Weapon" feature`);
}
// check if the actor has Channel Divinity charges left
else if (find("Channel Divinity", actor?.sourcedItems.entries()).system.uses.value <= 0) {
    ui.notifications.error(`The selected actor has no more Channel Divinity charges left`);
}

//LOGIC
// Create a Dialog box to select the weapon to buff
let optionsText = ""; // all weapons to choose from
let allWeapons = actor?.items.filter(entry => entry.type === "weapon");
for (let i = 0; i < allWeapons.length; i++) {
    optionsText += `<option value="${i}">${allWeapons[i].name}</option>`;
}
let confirmed = false;
new Dialog({
    title: "Sacred Weapon: Usage Configuration",
    content: `
    <form id="weaponToBuff-form">
        <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Channel Divinity: Sacred Weapon", type: "feature"}) + `</p>
        <div class="form-group">
            <label>Weapon To Buff</label>
            <div class="form-fields">
                <select name="weaponToBuff">${optionsText}</select>
            </div>
        </div>
        
        <div class="form-group">
            <label class="checkbox">
                <input type="checkbox" name="consumeCheckbox" checked/>
                Use Channel Divinity Resource?
            </label>
        </div>
        <div class="form-group"><label>Token's Charisma Modifier: ${cha}</label></div>
        
    </form>
    `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Buff",
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
            // remove Channel Divinity Slot
            const changedValue = find("Channel Divinity", actor?.sourcedItems.entries()).system.uses.value - 1;
            find("Channel Divinity", actor?.sourcedItems.entries()).update({"system.uses.value": changedValue});
            // add cha to selected weapon
            weapon = allWeapons[parseInt(html.find('[name=weaponToBuff]')[0].value)];
            const originaAtckBonus = weapon.system.attack.bonus;
            weapon.update({"system.attack.bonus": (originaAtckBonus == 0 ? "" : originaAtckBonus + "+") + cha});
            // add the magical propertie if not already there
            let wasMgc = true;
            if (find('mgc', weapon.system.properties) === undefined) {
                wasMgc = false;
                let properties = weapon.system.properties;
                properties.add('mgc');
                weapon.update({"system.properties": properties});
            }
            //add flag hat effect is active
            actor?.update({'flags.scweapon': {'active': true, 'weaponId': weapon.id, 'originaAtckBonus': originaAtckBonus, 'wasMgc': wasMgc}});
           }
    }
}).render(true);