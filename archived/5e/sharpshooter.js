if (!Boolean(actor)) return ui.notifications.warn("Please select a token.");
if (!Boolean(actor.items.find(i => i.name === 'Sharpshooter'))) return ui.notifications.warn("Please select a single token with the Sharpshooter feat.");

let atkModifier = -5;
let dmgModifier = 10;
const isEnabled = Boolean(actor.data.flags.ssMacro?.isEnabled);

const disableSharpshooter = (item) => item.update({
    'data.damage.parts': item.data.flags.ssMacro.oldDmg,
    'data.attackBonus': item.data.flags.ssMacro.oldAtk ?? 0,
    'flags.ssMacro': null
});

const enableSharpshooter = (item) => {
    let oldDmg = JSON.parse(JSON.stringify(item.data.data.damage.parts));
    item.data.data.damage.parts[0][0] = `${item.data.data.damage.parts[0][0]} + ${dmgModifier}`;

    item.update({
        'flags.ssMacro.oldDmg': oldDmg,
        'flags.ssMacro.oldAtk': JSON.parse(JSON.stringify(item.data.data.attackBonus ?? 0)),
        'data.damage.parts': item.data.data.damage.parts,
        'data.attackBonus': `${+(item.data.data.attackBonus || 0) + atkModifier}`
    });
}

actor.update({ 'flags.ssMacro.isEnabled': !isEnabled });
for (let item of actor.items) {
    let isRangedWeapon = getProperty(item, 'data.data.actionType') === 'rwak' && getProperty(item, 'data.type') === 'weapon';

    if (isRangedWeapon && item.data.data.damage.parts.length > 0)
        isEnabled ? disableSharpshooter(item) : enableSharpshooter(item);
}

ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    content: isEnabled ? `${actor.name} is aiming normally now.` : `${actor.name} is aiming for vital areas.`,
}, {});
