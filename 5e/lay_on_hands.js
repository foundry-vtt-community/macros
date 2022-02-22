/**
 * System: D&D5e
 * Apply lay-on-hands feat to a target character.  Asks the player how many HP to heal and
 * verifies the entered value is within range before marking down usage counter. If the player
 * has OWNER permissions of target (such as GM or self-heal) the HP are applied automatically; 
 * otherwise, a 'roll' message appears allowing the target character to right-click to apply healing.
 */

(async () => {

const layName = "Lay on Hands";
let confirmed = false;
let actorData = actor || canvas.tokens.controlled[0] || game.user.character;
let featData = actorData ? actorData.items.find(i => i.name===layName) : null;

if(actorData == null || featData == null) 
    ui.notifications.warn(`Selected hero must have ${layName} feat.`);
else if (game.user.targets.size !== 1)
    ui.notifications.warn(`Please target one token.`);
else
{
    let featUpdate = duplicate(featData);
    let targetActor = game.user.targets.values().next().value.actor;
    let maxHeal = Math.clamped(featUpdate.data.uses.value, 0, 
        targetActor.data.data.attributes.hp.max - targetActor.data.data.attributes.hp.value);

    let content = `<p><em>${actorData.name} lays hands on ${targetActor.data.name}.</em></p>
                    <p>How many HP do you want to restore to ${targetActor.data.name}?</p>
                    <form>
                        <div class="form-group">
                            <label for="num">HP to Restore: (Max = ${maxHeal})</label>
                            <input id="num" name="num" type="number" min="0" max="${maxHeal}"></input>
                        </div>
                        <div class="form-group">
                            <label for="flavor">Flavor:</label>
                            <input id="flavor" name="flavor" value="${featUpdate.data.chatFlavor}"></input>
                        </div>
                    </form>`;
    new Dialog({
        title: "Lay on Hands Healing",
        content: content,      
        buttons: {
            heal: { label: "Heal!", callback: () => confirmed = true },
            cancel: { label: "Cancel", callback: () => confirmed = false }
        },
        default: "heal",

        close: html => {
            (async () => {
            if (confirmed) 
            {
                let number = Math.floor(Number(html.find('#num')[0].value));
                if (number < 1 || number > maxHeal)
                    ui.notifications.warn(`Invalid number of charges entered = ${number}. Aborting action.`);
                else
                {
                    let flavor = `<strong>${html.find('#flavor')[0].value}</strong><br>`;
                    if (targetActor.permission !== CONST.ENTITY_PERMISSIONS.OWNER)
                        // We need help applying the healing, so make a roll message for right-click convenience.
                        await new Roll(`${number}`).toMessage({
                            speaker: ChatMessage.getSpeaker(),
                            flavor: `${actorData.name} lays hands on ${targetActor.data.name}.<br>${flavor}
                            <p><em>Manually apply ${number} HP of healing to ${targetActor.data.name}</em></p>` });
                    else {
                        // We can apply healing automatically, so just show a normal chat message.
                        ChatMessage.create({
                            speaker: ChatMessage.getSpeaker(),
                            content: `${actorData.name} lays hands on ${targetActor.data.name} for ${number} HP.<br>${flavor}`
                        });
                        await targetActor.update({"data.attributes.hp.value" : targetActor.data.data.attributes.hp.value + number});
                    }
                     
                    //Update the value under "Features"
                    featUpdate.data.uses.value = featUpdate.data.uses.value - number;
                    await actorData.items.getName(layName).update({ "data.uses.value" : featUpdate.data.uses.value });

                    //Update resource counter only if the "Lay on Hands" feature is set to consume it
                    let resString = featUpdate.data.consume.target;
                    if(resString.indexOf('resources') >= 0) {
                       await actorData.update({
                           data: { [featUpdate.data.consume.target] : featUpdate.data.uses.value }
                       });
                    }

                    if (actorData.sheet.rendered) {
                       // Update the actor sheet if it is currently open
                       await actorData.render(true);
                    }
                };
            }
            })();
        }
    }).render(true);
}
})();
