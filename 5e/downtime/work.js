/*global Roll, character, ui, ChatMessage, Dialog*/

// Pull this data to add to the dialog
const playercharacter = character.getRollData();
const athmod = playercharacter.skills.ath.total;
const acrmod = playercharacter.skills.acr.total;
const prfmod = playercharacter.skills.prf.total;
// Create a dialog and ask the player to chose what skill they want
new Dialog({
    title: 'Choose which skill',
    buttons:{
        str: {
            icon: '<i class="fas fa-hand-holding-medical"></i>',
            label: `Strength (Athletics): ` + athmod,
            callback: () => main("strength"),
        },
        dex: {
            icon: '<i class="fas fa-hand-holding-medical"></i>',
            label: `Dexterity (Acrobatics): ` + acrmod,
            callback: () => main("dexterity"),
        },
        cha: {
            icon: '<i class="fas fa-medkit"></i>',
            label: `Charisma (Performance): ` + prfmod,
            callback: () => main("charisma"),
        }
    }}).render(true);

async function main(work){
    if (character == null) {
        ui.notifications.error("You have no selected character");
        return;
    }
    if (work === "strength") {
        let rollresult = await new Roll(`1d20+${athmod}`).evaluate({async: true});
        message(rollresult);
    } else if (work === "dexterity") {
        let rollresult = await new Roll(`1d20+${acrmod}`).evaluate({async: true});
        message(rollresult);
    } else if (work === "charisma") {
        let rollresult = await new Roll(`1d20+${prfmod}`).evaluate({async: true});
        message(rollresult);
    }
    async function message(result) {
        let complicationroll = await new Roll(`1d100`).evaluate({async: true});
        let chatMsg = ''
        if (result.total < 10) {
            chatMsg = "Poor lifestyle for the week"
        } else if (result.total >= 10 && result.total <= 14) {
            chatMsg = "Modest lifestyle for the week"
        } else if (result.total >= 15 && result.total <= 20) {
            chatMsg = "Comfortable lifestyle for the week"
        } else {
            chatMsg = "Comfortable lifestyle for the week + 25 gp"
        }
        chatMsg += `
        <details closed="">
            <h3>Roll result</h3>
            <span style='font-size:18.0pt;color:black;mso-color-alt:windowtext'>
                ${result.result}
            </span>
        </details>
        `
        // Send the chat message
        ChatMessage.create({content: chatMsg, speaker: ChatMessage.getSpeaker()});
        // Check to see if a complication arises and output a message if so
        if (complicationroll.total <= 10) {
            ChatMessage.create({content: "Complication!", speaker: ChatMessage.getSpeaker()});
        }
    }
}