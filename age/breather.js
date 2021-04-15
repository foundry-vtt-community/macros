/* This macro is specific to the AGE System (unoffical) game system.
 *
 * In AGE system games such as Modern AGE, The Expanse, etc., a character
 * may restore 1d6 + level + CON health at the end of a scene by
 * "taking a breather". This macro automates that for players or GM
 * along with generating a friendly chat message to announce this
 * in the chat log.
 *
 * This macro requires that the game system be "age-system" so that
 * the actor will have the appropriate structure.
 * 
 * Oringial macro code: vkdolea
 */

if (game.system.id === 'age-system') {
   let flavor = "Taking a breather here, boss...";
   // Change the value between "" to change flavor on chat message

   // Make sure we've got an actor selected
   let ageSystemActor = null;
   if (speaker.token) ageSystemActor = game.actors.tokens[speaker.token];
   if (!ageSystemActor ) ageSystemActor = game.actors.get(speaker.actor);
   if (ageSystemActor ) {
      // Collect the infor we'll need to perform the roll
      let rollData = {};
      rollData.level = ageSystemActor .data.data.level;
      rollData.cons = ageSystemActor .data.data.abilities.cons.total;

      // Revise token chat if ancestry/origin === Belter
      if (ageSystemActor.data.data.ancestry === 'Belter') {
         flavor = "Mi leta-go wa bek xiya bosmang";
      }

      // Configure the chat message to be sent
      const chatMessage = {flavor, speaker};

      // Make the roll and send the message
      let roll = new Roll("1d6 + @level + @cons", rollData).roll();
      roll.toMessage(chatMessage);

      // Apply the effect
      const healed = roll.total;
      const curHP = ageSystemActor.data.data.health.value;
      const maxHP = ageSystemActor.data.data.health.max;
      let newHP = 0;
      if ((healed + curHP) > maxHP) {
         newHP = maxHP;
      } else {
         newHP = ageSystemActor.data.data.health.value + healed;
      }
      ageSystemActor.update({"data.health.value": newHP});
   }
}