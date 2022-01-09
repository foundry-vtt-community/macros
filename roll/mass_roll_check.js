/*
* Gets a list of selected tokens (or defaults to the user's character), provides a list of
* skills, and then makes a roll for all the selected tokens with that skill. It then spits out
* the poorly-formatted results to chat (or the GM if you uncomment the whisper line).
*/

let targetActors = getTargetActors().filter(a => a != null);
function checkForActors(){
    if (!targetActors.length > 0)
        throw new Error('You must designate at least one token as the roll target');
};
checkForActors();

// Choose roll type dialog
let rollTypeTemplate = `
<div>
    <div class="form-group">
        <label>Choose roll type</label>
        <select id="selectedType">
            <option value="save">Saving Throw</option>
            <option value="ability">Ability Check</option>
            <option value="skill">Skill Check</option>
        </select>
    </div>
</div>`;

let chooseCheckType = new Dialog({
    title: "Choose check type",
    content: rollTypeTemplate,
    buttons: {
        ok: {
            icon: '<i class="fas fa-check"></i>',
            label: "OK",
            callback:  async (html) => {
                let checkType = html.find("#selectedType")[0].value;
                selectedCheckDialog(checkType).render(true);
            }
        },
        cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel'
        }
    },
    default: "cancel"
});

// Choose ability mod dialog
function selectedCheckDialog(checkType) {

    let dialogTitle = getCheckDialogTitle(checkType);
    let dialogContent = getCheckTemplate(checkType);

    return new Dialog({
        title: dialogTitle,
        content: dialogContent,
        buttons: {
            ok: {
                icon: '<i class="fas fa-check"></i>',
                label: "OK",
                callback: async (html) => {
                    let id = html.find("#selectedAbility")[0].value;

                    let messageContent = `<div><h2>${checkType.toUpperCase()} Roll</h2></div>`
                    for (let a of targetActors) {
                        let name = a.name;
                        let mod = 0;               
                        switch (checkType) {
                            case "save":
                                mod = a.data.data.abilities[id].save;
                                messageContent += `${name}: <b>[[1d20+${mod}]]</b> (${game.dnd5e.config.abilities[id]} saving throw)<br>`;
                                break;
                            case "ability":
                                mod = a.data.data.abilities[id].mod + a.data.data.abilities[id].checkBonus;
                                messageContent += `${name}: <b>[[1d20+${mod}]]</b> (${game.dnd5e.config.abilities[id]} check)<br>`;
                                break;
                            case "skill":
                                mod = a.data.data.skills[id].total;
                                messageContent += `${name}: <b>[[1d20+${mod}]]</b> (${game.dnd5e.config.skills[id]} (${a.data.data.skills[id].ability}) check)<br>`;
                                break;
                            default:
                                objects = game.dnd5e.config.skills;
                                break;
                        }
                    }
    
                    let chatData = {
                        user: game.user.id,
                        speaker: game.user,
                        content: messageContent,
                        // Uncomment the following line if you want the results whispered to the GM.
                        // whisper: game.users.filter(u => u.isGM).map(u => u._id)
                    };
                    ChatMessage.create(chatData, {});
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: 'Cancel'
            }
        },
        default: "cancel"
    });
}

// Gets list of selected tokens, or if no tokens are selected then the user's character.
function getTargetActors() {
    const character = game.user.character;
    const controlled = canvas.tokens.controlled;
    let actors = [];

    if (controlled.length === 0) return [character] || null;

    if (controlled.length > 0) {
        let actors = [];
        for (let i = 0; i < controlled.length; i++) {
            actors.push(controlled[i].actor);
    }

    return actors;
}
else throw new Error('You must designate at least one token as the roll target');
}


// Gets a template of abilities or skills, based on the type of check chosen.
function getCheckTemplate(checkType) {
    let objects = new Object();
    
    switch (checkType) {
        case "save":
        case "ability":
            objects = game.dnd5e.config.abilities;
            break;
        case "skill":
            objects = game.dnd5e.config.skills;
            break;
        default:
            objects = game.dnd5e.config.skills;
            break;
    }

    let template = `
    <div>
        <div class="form-group">
            <label>Choose check</label>
            <select id="selectedAbility">`
    
            for (let [checkId, check] of Object.entries(objects)) {
                template += `<option value="${checkId}">${check}</option>`;    
            }            
    
    template += `</select>
        </div>
    </div>`;

    return template;
}

function getCheckDialogTitle(checkType) {
    switch (checkType) {
        case "save":
            return "Saving Throw"
        case "ability":
            return "Ability Check"
        case "skill":
            return "Skill Check"
        default:
            return "Unknown Check"
    }
}

chooseCheckType.render(true);
