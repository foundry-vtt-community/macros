// Prints the condition immunities, damage immunities, damage resistances and damage vulnerabilities of the currently selected token(s).
// Damage types that appeared in the previous chat message (e.g. due to a roll) are highlighted in red. 
// A DM can call this macro after a player rolled damage to quickly see if they need to apply full, half or double damage.
//
// Author: https://github.com/Nijin22
// Licence: MIT, see https://choosealicense.com/licenses/mit/

const damageTypes = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Non-Magical Physical",
                     "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder",
                     "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks"];

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


// Get traits
const traits = new Map();
traits.set("ci", "Condition Immunities");
traits.set("di", "Damage Immunities (No damage)");
traits.set("dr", "Damage Resistances (Half damage)");
traits.set("dv", "Damage Vulnerabilities (Double dmg)");
canvas.tokens.controlled.forEach(token => {
    let name = token.actor.name;
    msg += `<h2>${name}</h2>`;
    
    traits.forEach((traitDescr, traitId, map) => {
        // Clone 'default' 5e trait array
        var allTraits = [...token.actor.data.data.traits[traitId].value];
        
        // Custom traits
        allTraits = allTraits.concat(token.actor.data.data.traits[traitId].custom.split(";").map(x => x.trim()));
        
        var printableTraits = allTraits.join("; ");
        if (printableTraits.length == 0) {
            printableTraits = "-";
        }
        msg += `<h3>${traitDescr}</h3><p>${printableTraits}</p>`;
    });
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

ui.notifications.info(msg);

// Post message to self
/*ChatMessage.create({
    content: msg,
    whisper: [game.user._id]
});*/
