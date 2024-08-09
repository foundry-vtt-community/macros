/** 
 * @name Planescape_Belief_Points_Luck_Roll
 * 
 * @author:  David Mora <me@davidmora.email>
 * 
 * @description:
 * This is inspired in belief points from the Planewalkers Handbook for AD&D 2nd Edition
 * 
 * We have a custom ability called "cua_0" that is used to store the belief points for each character
 * 
 * We also created a feature that gives you a bonus to your rolls based on your belief points, 
 * same as it was in the Planewalkers Handbook
 * 
 * With this system we ditched the whole Inspiration system and replaced it with a system that actually represents
 * how the multiverse reacts to a character being aligned with their beliefs
 * 
 * Luck rolls are made whenever a situation is uncertain and the DM needs to resolve whether something is available or who is affected
 * for example:
 * 
 * - A character is looking for a rare item in a shop
 * - An enemy is going to attack someone in the party, but the DM is not sure who
 * - A character is trying to get information from an NPC and the DM is not sure if the NPC knows the information
 * - A character asks if "it is raining" and the DM calls for luck to see if it is raining
 * - Some other situation where the DM is not sure if something is available
 * 
 * This macro will roll for luck for all characters on the map
 * we are using a custom ability created with addon https://foundryvtt.com/packages/dnd5e-custom-skills 
 * if you want to use a different ability like charisma or wisdom, you can change the luckyAbility variable
 * try with different abilities like "cha", "wis", "int", "str", "dex", "con"
 **/ 
const luckyAbility = "cua_0"; 
// Get all character tokens on the map
const tokens = canvas.tokens.placeables.filter(token => token.actor?.type === "character");

const mods = tokens.map(token => {
    const actor = game.actors.get(token.actor.id);
    return {
        name: actor.name,
        belief: actor.system.abilities[luckyAbility].mod
    };
});

let result = `
    <h2>Multiverse favors the bold!</h2>
    <p>Let's roll for luck</p>
    <table>
        <tr><th>Character</th><th>Result</th></tr>
`;

let minimum;
let maximum;
let bestLuckCharacter;
let worstLuckCharacter;

for (const mod of mods) {
    const roll = await new Roll('1d20').roll();
    const rolled = roll.total + mod.belief;

    if (minimum === undefined || rolled < minimum) {
        minimum = rolled;
        worstLuckCharacter = mod.name;
    }
    if (maximum === undefined || rolled > maximum) {
        maximum = rolled;
        bestLuckCharacter = mod.name;
    }

    const isCritical = roll.total === 20;
    const isFumble = roll.total === 1;
    const rolledColor = isCritical ? "green" : isFumble ? "red" : "black";
    const rolledText = `<b style="color: ${rolledColor}">${rolled}</b>`;
    
    result += `
        <tr>
            <td>${mod.name}</td>
            <td>
                Rolled ${rolledText}<br/>
                1d20: <b style="color: ${rolledColor}">${roll.total}</b> + Belief (${mod.belief})
            </td>
        </tr>
    `;
}

result += `
    </table>
    <h3 style="color: green"><b>Best</b> luck character: ${bestLuckCharacter} with ${maximum}</h3>
    <h3 style="color:red"><b>Worst</b> luck character: ${worstLuckCharacter} with ${minimum}</h3>
`;

const chatData = {
    user: game.user.id,
    content: result,
};

ChatMessage.create(chatData, {});
