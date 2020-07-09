/**
 * Rolls a d20. If the roll is below a 3, it rerolls the value. Adds perception total + 1 as well.
 */

let dice = new Roll('1d20 + @skills.prc.total + 1').roll();
if (dice.total <= (4 + actor.data.data.skills.prc.total)) dice.reroll();
dice.toMessage();
