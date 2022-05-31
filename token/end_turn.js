/*
Author: willisrocks
Description: 

Ends the current actors turn in a combat encounter. Useful when you don't pop out your combat tracker
and want to end the turn from your hotbar.

If the user is a gamemaster, it will always end the current turn. For players, it will only end 
the turn when the current actor in the turn order is owned by you. 

Based on the work of reddit user serrag97: https://www.reddit.com/r/FoundryVTT/comments/j1b8gs/next_turn_shortcut/
*/

// check if the user is a GM
const isGM = game.user.isGM;
// check if the user owns the combatant whose turn it is
const isOwner = game.combat.combatant.isOwner;

if (isGM || isOwner) {
  game.combat.nextTurn();
} else {
  ui.notifications.info("As a player you can only advance your turn");
}
