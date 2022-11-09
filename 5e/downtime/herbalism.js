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
    const medmod = actor.skills.med.total;
    const natmod = actor.skills.nat.total;
    const surmod = actor.skills.sur.total;
    // Do all the relevant rolls
    let medicineroll = await new Roll(`1d20+${medmod}`).evaluate({async: true});
    let natureroll = await new Roll(`1d20+${natmod}`).evaluate({async: true});
    let survivalroll = await new Roll(`1d20+${surmod}`).evaluate({async: true});
    let medicinecontest = await new Roll(`2d10+5`).evaluate({async: true});
    let naturecontest = await new Roll(`2d10+5`).evaluate({async: true});
    let survivalcontest = await new Roll(`2d10+5`).evaluate({async: true});
    let complicationroll = await new Roll(`1d100`).evaluate({async: true});
    
    // Tally the successes
    var successes = 0
    if (medicineroll.total >= medicinecontest.total) {
        successes++;
    }
    if (natureroll.total >= naturecontest.total) {
        successes++;
    }
    if (survivalroll.total >= survivalcontest.total) {
        successes++;
    }
    let chatMsg = ''
    // Give gold based on the successes
    switch (successes) {
        case 0:
            chatMsg = "You fail to find any usable/noteworthy fauna or flora"
            break;
        case 1:
            chatMsg = "You find one specimen"
            break;
        case 2:
            chatMsg = "You find two specimen"
            break;
        case 3:
            chatMsg = "You find three specimen"
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
    let medicineMsg = formatmessage(medicineroll.total, medicinecontest.total);
    let natureMsg = formatmessage(natureroll.total, naturecontest.total);
    let survivalMsg = formatmessage(survivalroll.total, survivalcontest.total);
    chatMsg += `
    <details closed="">
        <h3>Medicine test</h3>
        ${medicineMsg}
        <h3>Nature test</h3>
        ${natureMsg}
        <h3>Survival test</h3>
        ${survivalMsg}
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