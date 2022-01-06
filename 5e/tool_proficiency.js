/**
 * Grab a list of tools in the selected player's inventory, then all the user to make a roll on the tool.
 * Will take into consideration if the player is proficient in using the tool.
 */

// get the first entry from the array of currently selected tokens. Works best/exclusively with one selected token
const target = canvas.tokens.controlled[0].actor;
// get the abilities of the selected token for ease of access later
const { abilities } = target.data.data;
// Only items set as "tools" will be included!
// get all held and equipped Tools/Kits/Supplies. Might want to replace with /[tT]ools|[kK]it|[sS]upplies|[sS]et$/ if gaming sets should be included
const toolsInInventory = target.items.filter( item => item.name.match(/[tT]ools|[kK]it|[sS]upplies$/) && item.data.data.hasOwnProperty("proficient"));
// const toolProficiencies = target.data.data.traits.toolProf; // Tools have proficiency mod in the object under <item>.data.data.proficient. 
let tool = undefined;

// Choose ability mod dialog
const abilityDialog = (async () => {
    let template = `
    <div>
        <div class="form-group">
            <label>Choose ability</label>
            <select id="selectedAbility">`
    for (let ability in abilities) {
        switch (ability) {
            case "str":
                abilities[ability].name = "Strength"
                break;
            case "dex":
                abilities[ability].name = "Dexterity"
                break;
            case "con":
                abilities[ability].name = "Constitution"
                break;
            case "int":
                abilities[ability].name = "Intelligence"
                break;
            case "wis":
                abilities[ability].name = "Wisdom"
                break;
            case "cha":
                abilities[ability].name = "Charisma"
                break;
            default:
                console.log("something went wrong");
        }
        template += `<option value="${ability}">${abilities[ability].name} (${abilities[ability].value})</option>`;
    }
    template += `</select>
        </div>
    </div>`


    new Dialog({
        title: tool.name,
        content: template,
        buttons: {
            ok: {
                icon: '<i class="fas fa-check"></i>',
                label: "OK",
                callback: async (html) => {
                    const selection = html.find("#selectedAbility")[0].value;
                    console.log(tool, target);
                    let prof = tool.data.data.proficient * target.data.data.attributes.prof; // target might be half or doubly proficient. This will make sure it is accounted for

                    let messageContent = `${target.name} rolled a <b>[[1d20+${abilities[selection].mod}(${abilities[selection].name})+${prof}(Proficiency)]]</b> for the ${tool.name} check.<br>`;
                    let chatData = {
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker(),
                        content: messageContent,
                        // uncomment the line below to always whisper the roll to the GM
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
    }).render(true);
})

// Choose tool dialog
if (toolsInInventory.length) {
    (async () => {
        let template = `
        <div>
            <div class="form-group">
                <label>Choose a tool</label>
                <select id="selectedTool">`
        toolsInInventory.forEach( tempTool => {    
            template += `<option value="${tempTool.name}">${tempTool.name}</option>`;
        });
        template += `</select>
            </div>
        </div>`;

        new Dialog({
            title: 'Which tool?',
            content: template,
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "OK",
                    callback: async (html) => {
                        let selection = html.find("#selectedTool")[0].value;
                        tool = toolsInInventory.find( item => item.name === selection )
                        abilityDialog();
                   }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'Cancel'
                }
            },
            default: "cancel"
        }).render(true);
    })()    
}

else {
    new Dialog({
        title: 'No Tools!',
        content: '<p>You don\'t seem to have any tool with you.</p>',
        buttons: {
            ok: {
                icon: '<i class="fas fa-check"></i>',
                label: "OK"
            }
        },
        default: "ok"
    }).render(true);
}
