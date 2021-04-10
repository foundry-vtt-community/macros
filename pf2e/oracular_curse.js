/**
 *  This macro is meant to aid Oracle (N)PCs in tracking their current curse level.
 *  Clicking the macro with the token selected will increment the curse according to the following:
 *  None -> Minor -> Overwhelmed if the Actor does not have the "Major Curse" feat,
 *  None -> Minor -> Major -> Overwhelmed if the Actor does not have the "Extreme Curse" feat,
 *  None -> Minor -> Major -> Extreme -> Overwhelmed otherwise.
 *
 *  NOTE: you need to add paths to the icons representing the curse conditions, as this is the hacky way
 *  in which this macro tracks the curse progression!
 *
 *  ALSO NOTE: you might want to fill in the curse specifics yourself to make things easier in the heady
 *  rush of an battle.
 */

let messageContent = "";
if (!actor) {
    ui.notifications.warn("You must have an actor selected.");
}

const FEAT_CURSE = "Oracular Curse";
const FEAT_CURSE_MAJOR = "Major Curse";
const FEAT_CURSE_EXTREME = "Extreme Curse";

const ICON_MIN = "/path/to/curse_minor.png";
const ICON_MOD = "/path/to/curse_moderate.png";
const ICON_MAJ = "/path/to/curse_major.png";
const ICON_EXT = "/path/to/curse_extreme.png";
const ICON_OVER = "/path/to/curse_overwhelmed.png";

const MSG_NONE = `You are no longer cursed.`;

const MSG_MIN = `<hr/><h3>Oracular Curse (Minor):</h3><hr/>
Minor curse goes here.`;

const MSG_MOD = `<hr/><h3>Oracular Curse (Moderate):</h3><hr/>
Moderate curse goes here.`;

const MSG_MAJ = `<hr/><h3>Oracular Curse (Major):</h3><hr/>
Major curse goes here.`;

const MSG_EXTREME = `<hr/><h3>Oracular Curse (Extreme):</h3><hr/>
Extreme curse goes here.`;

const MSG_OVER = `<hr/><h3><img width="36" height="36" src="/path/to/overwhelmed.png"/>Oracular Curse (Overwhelmed):</h3><hr/>
Drawing upon your mystery"s power while your curse is at its worst causes an irreconcilable conflict between you and the sources of your power. Immediately after casting a revelation spell while under the moderate effect of your curse, you are <strong>overwhelmed</strong>.
<hr/>
While <strong>overwhelmed</strong>, you can"t Cast or Sustain any revelation spells — you effectively lose access to those spells. You can still Refocus to reduce the effects of your curse and regain a Focus Point, but doing so doesn"t allow you to cast further revelation spells. These effects last until you rest for 8 hours and make your daily preparations, at which point your curse returns to its basic state. At higher levels, you can grow to withstand your curse"s major and even extreme effects, enabling you to cast more revelation spells without becoming overwhelmed.
<hr/>
Your curse has the curse, divine, and necromancy traits. You can"t mitigate, reduce, or remove the effects of your oracular curse by any means other than Refocusing and resting for 8 hours. For example, if your curse makes creatures concealed from you, you can"t negate that concealed condition through a magic item or spell, such as true strike (though you would still benefit from the other effects of that item or spell). Likewise, remove curse and similar spells don"t affect your curse at all.`;


(async () => {
    for (const token of canvas.tokens.controlled) {
        let canDoCurse = (token.actor.items.find(i => i.name == FEAT_CURSE) !== null);
        let canDoMajor = (token.actor.items.find(i => i.name == FEAT_CURSE_MAJOR) !== null);
        let canDoExtreme = (token.actor.items.find(i => i.name == FEAT_CURSE_EXTREME) !== null);

        let isOverwhelmed = token.data.effects.includes(ICON_OVER);
        let hasExtremeCurse = token.data.effects.includes(ICON_EXT);
        let hasMajorCurse = token.data.effects.includes(ICON_MAJ);
        let hasModerateCurse = token.data.effects.includes(ICON_MOD);
        let hasMinorCurse = token.data.effects.includes(ICON_MIN);

        if (!canDoCurse) {
            ui.notifications.warn("The selected token does not have the Oracular Curse feat!");
            return;
        }

        if (isOverwhelmed) {
            // TODO: remove curse afflicitions
            messageContent = MSG_NONE;
            await token.toggleEffect(ICON_OVER);
            return;
        }

        if (hasMajorCurse) {
            if (canDoExtreme) {
                // TODO: add extreme curse effects
                messageContent = MSG_EXTREME;
                await token.toggleEffect(ICON_EXTREME);
                return;
            }

            // else: straight to overwhelmed
            messageContent = MSG_OVER;
            await token.toggleEffect(ICON_OVER);
            await token.toggleEffect(ICON_MAJ);
            return;
        }

        if (hasModerateCurse) {
            if (canDoMajor) {
                // TODO: add major curse effects
                messageContent = MSG_MAJ;
                await token.toggleEffect(ICON_MOD);
                await token.toggleEffect(ICON_MAJ);
                return;
            }

            // else: straight to overwhelmed
            messageContent = MSG_OVER;
            await token.toggleEffect(ICON_MOD);
            await token.toggleEffect(ICON_OVER);
            return;
        }

        if (hasMinorCurse) {
            // TODO: add moderate curse effects
            messageContent = MSG_MOD;
            await token.toggleEffect(ICON_MIN);
            await token.toggleEffect(ICON_MOD);
            return;
        }

        // engage minor curse
        // TODO: add minor curse effects
        messageContent = MSG_MIN;
        await token.toggleEffect(ICON_MIN);
        return;
    }
})();

// create the message
if (messageContent !== "") {
    let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: messageContent,
    };
    ChatMessage.create(chatData, {});
}
