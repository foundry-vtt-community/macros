/**
 * Takes all selected tokens and adds them to the combat tracker. Then rolls initative for all NPC tokens.
 */
async function main() {
  await canvas.tokens.toggleCombat();
  game.combat.rollNPC({ messageOptions: { rollMode: CONST.DICE_ROLL_MODES.PRIVATE }})
}
main();
