if (!Boolean(actor)) return ui.notifications.warn("Please select a token.");
if (!Boolean(actor.items.find(i => i.name === 'Sharpshooter'))) return ui.notifications.warn("Please select a single token with the Sharpshooter feat.");

let atkModifier = -5;
let dmgModifier = 10;
const isEnabled = Boolean(actor.data.flags.ssMacro?.isEnabled);

const toggleSharpshooter = async (item) => {
    const atk = isEnabled ? (+item.data.data.attackBonus || 0) - atkModifier : (+item.data.data.attackBonus || 0) + atkModifier;
    const damage = JSON.parse(JSON.stringify(item.data.data.damage.parts));
    damage[0][0] = isEnabled ? damage[0][0].replace(` + ${dmgModifier}`,'') : `${damage[0][0]} + ${dmgModifier}`;

    await item.update({
        'data.damage.parts': damage,
        'data.attackBonus': `${atk}`
    });
}

await actor.update({ 'flags.ssMacro.isEnabled': !isEnabled });
for (let item of actor.items) {
    let isRangedWeapon = getProperty(item, 'data.data.actionType') === 'rwak' && getProperty(item, 'data.type') === 'weapon';

    if (isRangedWeapon && item.data.data.damage.parts.length > 0)
        await toggleSharpshooter(item);
}

ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: isEnabled ? `${actor.name} is aiming normally now.` : `${actor.name} is aiming for vital areas.`,
}, {});
