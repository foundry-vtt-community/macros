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
        }
        else {
            for(let token of canvas.tokens.controlled) {
                if(token.id === game.combats.active.current.tokenId) {
                    game.combats.active.nextTurn();
                    return;
                }
            }

            ui.notifications.info('As a player you can only advance your turn');
        }

        return;
    } catch(e) {
        ui.notifications.error(e);
        return;
    }
}
