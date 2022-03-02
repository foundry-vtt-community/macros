//Script to roll a die
//Equivalently could be done by changing the macro to chat and entering /r 1d6
//You can roll any number and any type of dice by changing Roll to ndx
    //n: number of dice
    //x: value (number of sides) on die
const roll = new Roll(`1d6`);
await roll.toMessage({
    flavor: "Sneak Attack Damage",
});
