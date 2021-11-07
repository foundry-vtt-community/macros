// Initiative with Disadvantage by Nulmas#9462
// Thanks to Freeze#2689, vance#1935 and u/Azzu for the help.

// This macro allows GMs and players to roll for Initiative with disadvantage when playing D&D 5e. Hopefully it won't be needed for long and the option for it will be added 
// to the system in a future release.

// The macro will roll for all the selected tokens and add them to the combat if they aren't in it already. It will also check if you are using Dex as a tiebreaker and roll
// accordingly.

// BEWARE: If a token has already rolled for initiative and you use this macro with it selected, the new initiative will replace the old one. I considered changing this, but
// decided it's worth keeping it this way in case a player or GM rolls for initiative without disadvantage by mistake.

(async () => {
    if (canvas.tokens.controlled.length === 0) return ui.notifications.error("Choose tokens to roll for");
    await canvas.tokens.toggleCombat();
    let chosenTokens = canvas.tokens.controlled;
    let tieBreakerCheck = game.settings.get("dnd5e", "initiativeDexTiebreaker") ? 1 : 0; //Checks if Dex tiebreaker is being used
    let initiatives = chosenTokens.map(t => {
        let chosenActor = t.actor;
        let advantage = chosenActor.getFlag("dnd5e", "initiativeAdv") ? 1 : 0;
        let init = chosenActor.data.data.attributes.init.total;
        let tieBreaker = chosenActor.data.data.abilities.dex.value/100;
        let roll = new Roll(`${2 - advantage}d20kl + ${init} + ${tieBreaker * tieBreakerCheck}`).roll({async: false});
        roll.toMessage({speaker: ChatMessage.getSpeaker({token: t.document})});
        let combatantId = t.combatant.id;
        return{
            _id: combatantId,
            initiative: roll.total,
        };
    });
    await game.combat.updateEmbeddedDocuments("Combatant", initiatives);
})();
