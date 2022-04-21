/*
 *  This macro is meant to aid Oracle (N)PCs in tracking their current curse level.
 *  Clicking the macro with the token selected will increment the curse according to the following:
 *  None -> Minor -> Overwhelmed if the Actor does not have the "Major Curse" feat,
 *  None -> Minor -> Major -> Overwhelmed if the Actor does not have the "Extreme Curse" feat,
 *  None -> Minor -> Major -> Extreme -> Overwhelmed otherwise.
 *
 *  NOTE: you need to add paths to the icons representing the curse conditions, as this is the hacky way
 *  in which this macro tracks the curse progression!
 *
 *  ALSO NOTE: We try to extract the relevant pieces of information from the actor's Mystery feat. 
 *  This might not work, so if not, you might want to fill in the curse specifics yourself
 *  to make things easier in the heat of battle.
 */

let messageContent = "";
if (!actor) {
    ui.notifications.warn("You must have an actor selected.");
}

const FEAT_ORACLE_CURSE = "Oracular Curse";
const FEAT_ORACLE_CURSE_MAJOR = "Major Curse";
const FEAT_ORACLE_CURSE_EXTREME = "Extreme Curse";

const ICON_MINOR = "/path/to/curse_minor.png";
const ICON_MODERATE = "/path/to/curse_moderate.png";
const ICON_MAJOR = "/path/to/curse_major.png";
const ICON_EXTREME = "/path/to/curse_extreme.png";
const ICON_OVERWHELMED = "/path/to/curse_overwhelmed.png";

// RegExps to extract relevant data from the actor's Mystery Feat.
const EXPR_MINOR = /(<strong>\s*Minor\s*Curse.+?)<strong>\s*Moderate/is;
const EXPR_MODERATE = /(<strong>\s*Moderate\s*Curse.+?)<strong>\s*Major/is;
const EXPR_MAJOR = /(<strong>\s*Major\s*Curse.+?)$/is;

const MSG_NONE = `You are no longer cursed.`;
const MSG_MINOR = `<hr/><h3>Oracular Curse (Minor):</h3><hr/>`;
const MSG_MODERATE = `<hr/><h3>Oracular Curse (Moderate):</h3><hr/>`;
const MSG_MAJOR = `<hr/><h3>Oracular Curse (Major):</h3><hr/>
You've learned to better balance the conflicting powers wreaking havoc on your body. Immediately after completing the casting of a revelation spell while you are affected by your moderate curse, your curse progresses to its major effect, rather than overwhelming you. This effect lasts until you Refocus, which reduces your curse to its minor effect. If you cast a revelation spell while under the effects of your major curse, you are overwhelmed by your curse.
<br/>
In addition, increase the number of Focus Points in your focus pool from 2 to 3. If you spend at least 2 Focus Points before you again Refocus, you recover 2 Focus Points when you Refocus instead of 1.
<hr/>
`;

const MSG_EXTREME = `<hr/><h3>Oracular Curse (Extreme):</h3><hr/>
You have mastered a perilous balance between the conflicting divine powers of your mystery, gaining the power to change your fate, but straining both body and soul. When you cast a revelation spell while affected by your major curse, your curse intensifies to an extreme effect instead of overwhelming you. All mysteries share the same effects for their extreme curse.
<br/>
When affected by your extreme curse, you become Doomed 2 (or increase your doomed condition by 2 if you were already doomed). Once every 10 minutes, when you fail an attack roll, skill or Perception check, or saving throw, you can reroll it and use the second result.
<br/>
The reroll has the fortune trait and doesn't require you to spend an action, meaning you can use the reroll even if you can't act. These effects are in addition to all the effects of your major curse, and they can't be removed by any means until you Refocus to reduce your curse to its minor effect.
<br/>
If you cast a revelation spell while under the effects of this extreme curse, you are overwhelmed by your curse, and you remain doomed 2 even if you Refocus.
<br/>
Additionally, if you spend at least 3 Focus Points before you again Refocus, you recover 3 Focus Points when you Refocus instead of 1.
`;

const MSG_OVERWHELMED = `<hr/><h3>Oracular Curse (Overwhelmed):</h3><hr/>
Drawing upon your mystery"s power while your curse is at its worst causes an irreconcilable conflict between you and the sources of your power. Immediately after casting a revelation spell while under the moderate effect of your curse, you are <strong>overwhelmed</strong>.
<hr/>
While <strong>overwhelmed</strong>, you can't Cast or Sustain any revelation spells — you effectively lose access to those spells. You can still Refocus to reduce the effects of your curse and regain a Focus Point, but doing so doesn"t allow you to cast further revelation spells. These effects last until you rest for 8 hours and make your daily preparations, at which point your curse returns to its basic state. At higher levels, you can grow to withstand your curse"s major and even extreme effects, enabling you to cast more revelation spells without becoming overwhelmed.
<hr/>
Your curse has the curse, divine, and necromancy traits. You can't mitigate, reduce, or remove the effects of your oracular curse by any means other than Refocusing and resting for 8 hours. For example, if your curse makes creatures concealed from you, you can't negate that concealed condition through a magic item or spell, such as true strike (though you would still benefit from the other effects of that item or spell). Likewise, remove curse and similar spells don"t affect your curse at all.`;


(async () => {
    for (const token of canvas.tokens.controlled) {
        // only allow curses for tokens having the requisite feat
        let actorCurseFeat = token.actor.items.find(i => i.name == FEAT_ORACLE_CURSE);
        let canDoCurse = actorCurseFeat !== null;
        if (!canDoCurse) {
            ui.notifications.warn("The selected token does not have the Oracular Curse feat!");
            return;
        }

        // XXX: this will probably break horribly
        let actorMysteryFeat = token.actor.items.find(i => i.name.match("^.*Mystery\s*$"));
        if (actorMysteryFeat === null) {
            ui.notifications.warn("The selected token's actor does not have a mystery feat!");
            return;
        }

        let actorMajorFeat = token.actor.items.find(i => i.name == FEAT_ORACLE_CURSE_MAJOR);
        let actorExtremeFeat = token.actor.items.find(i => i.name == FEAT_ORACLE_CURSE_EXTREME);
        let canProgressToMajor = actorMajorFeat !== null;
        let canProgressToExtreme = actorExtremeFeat !== null;


        let isOverwhelmed = token.data.effects.includes(ICON_OVERWHELMED);
        let hasExtremeCurse = token.data.effects.includes(ICON_EXTREME);
        let hasMajorCurse = token.data.effects.includes(ICON_MAJOR);
        let hasModerateCurse = token.data.effects.includes(ICON_MODERATE);
        let hasMinorCurse = token.data.effects.includes(ICON_MINOR);

        // Overwhelmed -> None
        if (isOverwhelmed) {
            messageContent = MSG_NONE;
            await token.toggleEffect(ICON_OVERWHELMED);
            return;
        }
        
        // Extreme -> Overwhelmed
        if (hasExtremeCurse) {
            messageContent = MSG_OVERWHELMED;
            await token.toggleEffect(ICON_OVERWHELMED);
            await token.toggleEffect(ICON_EXTREME);
            return;
        }

        // Major -> (Extreme | Overwhelmed)
        if (hasMajorCurse) {
            if (canProgressToExtreme) {
                messageContent = MSG_EXTREME;
                await token.toggleEffect(ICON_MAJOR);
                await token.toggleEffect(ICON_EXTREME);
                return;
            }

            // else: straight to overwhelmed
            messageContent = MSG_OVERWHELMED;
            await token.toggleEffect(ICON_OVERWHELMED);
            await token.toggleEffect(ICON_MAJOR);
            return;
        }

	// Moderate -> (Major | Overwhelmed)
        if (hasModerateCurse) {
            if (canProgressToMajor) {
                messageContent = MSG_MAJOR;
                messageContent += actorMysteryFeat.data.data.description.value.match(EXPR_MAJOR)[1];
                await token.toggleEffect(ICON_MODERATE);
                await token.toggleEffect(ICON_MAJOR);
                return;
            }

            // else: straight to overwhelmed
            messageContent = MSG_OVERWHELMED;
            await token.toggleEffect(ICON_MODERATE);
            await token.toggleEffect(ICON_OVERWHELMED);
            return;
        }

	// Minor -> Moderate
        if (hasMinorCurse) {
            messageContent = MSG_MODERATE;
            messageContent += actorMysteryFeat.data.data.description.value.match(EXPR_MODERATE)[1];
            await token.toggleEffect(ICON_MINOR);
            await token.toggleEffect(ICON_MODERATE);
            return;
        }

        // None -> Minor
        messageContent = MSG_MINOR;
        messageContent += actorMysteryFeat.data.data.description.value.match(EXPR_MINOR)[1];
        await token.toggleEffect(ICON_MINOR);
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
