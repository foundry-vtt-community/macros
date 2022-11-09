/*global Roll, character, ui, ChatMessage*/
async function main(){
    // This is a JavaScript comment
    // Check to see if active character. If not, chat error
    if (character == null) {
        ui.notifications.error("You have no selected character");
        return;
    }
    // Do this to yoink all the possible rolls for a character
    const actor = character.getRollData();
    // Don't know if I need to do this tbh
    const athmod = actor.skills.ath.total;
    const acrmod = actor.skills.acr.total;
    // Pick the highest hit die from all classes
    var highestdie = false;
    for(let i = 0; i<Object.keys(actor.classes).length; i++){
        var newdie = actor.classes[Object.keys(actor.classes)[i]].hitDice.slice(1);
        if (newdie > highestdie) {
            highestdie = newdie;
        }
    }
    // Do all the relevant rolls
    let athleticsroll = await new Roll(`1d20+${athmod}`).evaluate({async: true});
    let acrobaticsroll = await new Roll(`1d20+${acrmod}`).evaluate({async: true});
    let constitutionroll = await new Roll(`1d20+1d${highestdie}`).evaluate({async: true});
    let athleticscontest = await new Roll(`2d10+5`).evaluate({async: true});
    let acrobaticscontest = await new Roll(`2d10+5`).evaluate({async: true});
    let constitutioncontest = await new Roll(`2d10+5`).evaluate({async: true});
    let complicationroll = await new Roll(`1d100`).evaluate({async: true});
    // Tally the successes
    var successes = 0
    if (athleticsroll.total >= athleticscontest.total) {
        successes++;
    }
    if (acrobaticsroll.total >= acrobaticscontest.total) {
        successes++;
    }
    if (constitutionroll.total >= constitutioncontest.total) {
        successes++;
    }
    let chatMsg = ''
    // Give gold based on the successes
    switch (successes) {
        case 0:
            chatMsg = "You lose all your bouts, earning nothing."
            break;
        case 1:
            chatMsg = "Win 50 gp."
            break;
        case 2:
            chatMsg = "Win 100 gp."
            break;
        case 3:
            chatMsg = "Win 200 gp."
            break;
    }
    function formatmessage(pcRoll, contestRoll) {
        // Make the chat messages look "nice"
        // -- Want to add result dependant colouring
        let rollMsgOpen = `
            <table class=MsoTableGrid border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse;border:none;mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt;mso-border-insideh:none;mso-border-insidev:none'>
                <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes'>
                    <td width=601 valign=top style='width:450.8pt;background:#D9D9D9;mso-background-themecolor:background1;mso-background-themeshade:217;padding:0cm 5.4pt 0cm 5.4pt'>
                        <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;line-height:normal'>
                            <b>
                                <span style='font-size:18.0pt;color:black;mso-color-alt:windowtext'>
                                    ${pcRoll}
                                </span>
                            </b>
                        </p>
                    </td>
                    <td width=601 valign=top style='width:450.8pt;background:#F2F2F2;mso-background-themecolor:background1;mso-background-themeshade:242;padding:0cm 5.4pt 0cm 5.4pt'>
                        <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;line-height:normal'>
                            <span style='font-size:16.0pt;color:black;mso-color-alt:windowtext'>
                                vs
                            </span>
                        </p>
                    </td>
                    <td width=601 valign=top style='width:450.8pt;background:#D9D9D9;mso-background-themecolor:background1;mso-background-themeshade:217;padding:0cm 5.4pt 0cm 5.4pt'>
                        <p class=MsoNormal align=center style='margin-bottom:0cm;text-align:center;line-height:normal'>
                            <b>
                                <span style='font-size:18.0pt;color:black;mso-color-alt:windowtext'>
                                    ${contestRoll}
                                </span>
                            </b>
                        </p>
                    </td>
                </tr>
            </table>
        `
        return rollMsgOpen;
    }
    let athleticMsg = formatmessage(athleticsroll.total, athleticscontest.total);
    let acrobaticMsg = formatmessage(acrobaticsroll.total, acrobaticscontest.total);
    let constitutionMsg = formatmessage(constitutionroll.total, constitutioncontest.total);
    chatMsg += `
    <details closed="">
        <h3>Athletics test</h3>
        ${athleticMsg}
        <h3>Acrobatics test</h3>
        ${acrobaticMsg}
        <h3>Constitution test</h3>
        ${constitutionMsg}
    </details>
    `
    // Send the chat message
    ChatMessage.create({content: chatMsg, speaker: ChatMessage.getSpeaker()});
    // Check to see if a complication arises and output a message if so
    if (complicationroll.total <= 10) {
        ChatMessage.create({content: "Complication!", speaker: ChatMessage.getSpeaker()});
    }
}

main()