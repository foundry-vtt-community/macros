/* This macro is specific to the AGE System (unoffical) game system.
 *
 * In AGE system games such as Modern AGE, The Expanse, etc., when a
 * character is reduced to 0 health they're not yet dead - it's more
 * like they've run out of luck. At that point any further damage
 * applied may be "bought off" by taking the injured condition if
 * they've not yet taken that condition, or the wounded condition
 * if they have already taken the injured condition. When taking
 * either injured or wounded, the character accounts for 1d6 points
 * of damage. Once wounded, any further damage will result in taking
 * the dying condition, at which point they will being to lose CON
 * points (1/round on their turn) until they reach -3, or until
 * someone successfully administers First Aid to stabalize them.
 * 
 * Use this macro if a character successfully applies First Aid
 * to a dying character to stabalize them and remove the dying
 * condition.
 * 
 * This macro requires that the game system be "age-system" so that
 * the actor will have the appropriate structure.
 * 
 * Author: schlosrat
 */

if (game.system.id === 'age-system') {
   // Responses based on the current conditions and situation
   let flavor1 = "Moaning: Uhhhhmmmmmnnnn";
   let flavor2 = "Uhhhh, what happened?";
   let flavor3 = "Did I miss anything?";
   let flavor4 = "I'm feeling much better now!";
   let flavor5 = "Knock it off! I don't need any more damn bandages!";

   // Get the speaker for the message
   // const this_speaker = ChatMessage.getSpeaker();

   let ageSystemActor = null;
   if (speaker.token) ageSystemActor = game.actors.tokens[speaker.token];
   if (!ageSystemActor ) ageSystemActor = game.actors.get(speaker.actor);
   if (ageSystemActor ) {
      let rollData = {};
      rollData.injured = actor .data.data.conditions.injured;
      rollData.wounded = actor .data.data.conditions.wounded;
      rollData.unconscious = ageSystemActor .data.data.conditions.unconscious;
      rollData.dying = ageSystemActor .data.data.conditions.dying;
      rollData.consv = ageSystemActor .data.data.abilities.cons.value;

      // Revise token chat if ancestry/origin === Belter
      if (ageSystemActor.data.data.ancestry === 'Belter') {
         flavor2 = "Uhhhh, keting ta go ere?";
         flavor3 = "ta du mi miss wating?";
         flavor4 = "Mi du sensa xélixup mogut xitim!";
         flavor5 = "Setop im! mi na du mowteng mo kaka felota xep!!";
      }

      // If the dying condition is currently set
      if (rollData.dying) {
         ageSystemActor.update({"data.conditions.dying": false});
         if (rollData.consv > -3) {
            ageSystemActor.update({"data.conditions.unconscious": false});
            ageSystemActor.update({"data.conditions.helpless": false});
            ChatMessage.create({speaker: speaker, content: flavor2});
         } else {
            ChatMessage.create({speaker: speaker, content: flavor1});
         }
      } else if (rollData.unconscious) {
         ChatMessage.create({speaker: speaker, content: flavor1});
      } else {
         ChatMessage.create({speaker: speaker, content: flavor5});
      }
   }
}
