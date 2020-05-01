/**
 * Takes all selected tokens and adds them to the combat tracker. Then rolls initative for all NPC tokens.
 */

async function start() {
  for ( let token of canvas.tokens.controlled) {      
    if (token.inCombat === false){
      // Change 'rollNPC' to 'rollAll' if you want to roll for your players as well.
      await token.toggleCombat().then(() => game.combat.rollNPC());
    }
  }
}

start();
