// Prints the condition immunities, damage immunities, damage resistances and damage vulnerabilities of the currently selected token(s).
// Damage types that appeared in the previous chat message (e.g. due to a roll) are highlighted in red. 
// A DM can call this macro after a player rolled damage to quickly see if they need to apply full, half or double damage.
//
// Author: https://github.com/Nijin22
// Licence: MIT, see https://choosealicense.com/licenses/mit/

const damageTypes = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"];

let msg = "";
let previousMessage;
try { 
    previousMessage = game.messages.entries[game.messages.entries.length-1].data.content;
} catch (e) {
    // No previous message in log. Default to an empty string.
    previousMessage = "";
}

// Enable case-insensitive replacements
// Source: https://stackoverflow.com/a/7313467
String.prototype.replaceAllCaseInsensitive = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

canvas.tokens.controlled.forEach(token => {
    let name = token.actor.name;
    let conditionImmunities = token.actor.data.data.traits.ci.value.join(", ");
    if (conditionImmunities.length === 0) {conditionImmunities = "-"}
    let damageImmunities = token.actor.data.data.traits.di.value.join(", ");
    if (damageImmunities.length === 0) {damageImmunities = "-"}
    let damageResistances = token.actor.data.data.traits.dr.value.join(", ");
    if (damageResistances.length === 0) {damageResistances = "-"}
    let damageVulnerabilities = token.actor.data.data.traits.dv.value.join(", ");
    if (damageVulnerabilities.length === 0) {damageVulnerabilities = "-"}
    
    msg += `
        <h2>${name}</h2>
        <h3>Condition Immunities</h3> <p>${conditionImmunities}</p>
        <h3>Damage Immunities (No damage)</h3> <p>${damageImmunities}</p>
        <h3>Damage Resistances (Half damage)</h3> <p>${damageResistances}</p>
        <h3>Damage Vulnerabilities (Double dmg)</h3> <p>${damageVulnerabilities}</p>
    `;
});

// highlight words from previous message
let damageTypesOfPrevousMsg = [];
damageTypes.forEach(damageType => {
    if (previousMessage.toLowerCase().indexOf(damageType.toLowerCase()) != -1){
        damageTypesOfPrevousMsg.push(damageType);
    }
});
damageTypesOfPrevousMsg.forEach(damageType => {
    msg = msg.replaceAllCaseInsensitive(damageType, `<span style="color:red; font-weight: bold;">${damageType}</span>`);
});


if (msg.length === 0) {
    msg = "No tokens selected.";
}

// Post message to self
ChatMessage.create({
    content: msg,
    whisper: [game.user._id]
});
