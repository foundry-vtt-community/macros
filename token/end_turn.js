/*
Author: willisrocks
Description: 

Ends the current actors turn in a combat encounter. Useful when you don't pop out your combat tracker
and want to end the turn from your hotbar.

If the user is a gamemaster, it will always end the current turn. For players, it will only end 
the turn when the current actor in the turn order is owned by you. 

Based on the work of reddit user serrag97: https://www.reddit.com/r/FoundryVTT/comments/j1b8gs/next_turn_shortcut/
*/


main()

async function main() {
    try {
        // If you have the Gamemaster role, you can advance
        // the turn for any actor
        const isGM = game.users.get(game.userId).hasRole(4);
        if (isGM) {
            game.combats.active.nextTurn();
            return;
        }

        // Otherwise, we check that the user owns the current token
        // in the turn order
        const currTokenId = game.combats.active.current.tokenId;
        const combatant = game.combats.active.data.combatants.find(c => c.tokenId === currTokenId);
        const player = combatant.players.find(p => p._id === game.userId);
        if (player) {
            game.combats.active.nextTurn();
            return;
        } else {
            ui.notifications.info('You can only advance the turn on your turn');
        }
    } catch(e) {
        ui.notifications.error(e);
        return;
    }
}
