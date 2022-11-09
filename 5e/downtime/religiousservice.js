/*global Roll, character, ui, ChatMessage, Dialog*/
// Pull this data to add to the dialog
const playercharacter = character.getRollData();
const relmod = playercharacter.skills.rel.total;
const permod = playercharacter.skills.per.total;
// Create a dialog and ask the player to chose what skill they want
new Dialog({
    title: 'Choose which skill',
    buttons:{
        int: {
            icon: '<i class="fas fa-hand-holding-medical"></i>',
            label: `Intelligence (Religion): ` + relmod,
            callback: () => main("intelligence"),
        },
        cha: {
            icon: '<i class="fas fa-medkit"></i>',
            label: `Charisma (Persuasion): ` + permod,
            callback: () => main("charisma"),
        }
    }}).render(true);

async function main(work){  
    if (character == null) {
        ui.notifications.error("You have no selected character");
        return;
    }
    if (work === "intelligence") {
        let rollresult = await new Roll(`1d20+${relmod}`).evaluate({async: true});
        message(rollresult);
    } else if (work === "charisma") {
        let rollresult = await new Roll(`1d20+${permod}`).evaluate({async: true});
        message(rollresult);
    }
    async function message(result) {
        let complicationroll = await new Roll(`1d100`).evaluate({async: true});
        let chatMsg = ''
        if (result.total <= 10) {
            chatMsg = "No effect. Your efforts fail to make a lasting impression."
        } else if (result.total >= 11 && result.total <= 20) {
            chatMsg = "You earn one favor."
        } else {
            chatMsg = "You earn two favors."
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

main()