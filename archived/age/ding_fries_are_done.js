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
 * This macro automates that process with firendly chat messages
 * to help all see what's going on.
 * 
 * This macro requires that the game system be "age-system" so that
 * the actor will have the appropriate structure.
 * 
 * Author: schlosrat
 */

if (game.system.id === 'age-system') {
   // Responses based on the condition(s) being applied
   let flavor1 = "Ouch! That hurt!";
   let flavor2 = "Dang! That really hurt!";
   let flavor3 = "Good by cruel world!";
   let flavor4 = "tick...";
   let flavor5 = "Ding! Fries are done!";
   let flavor6 = "He's dead, Jim!";

   // Get the speaker for the message
   // const this_speaker = ChatMessage.getSpeaker();

   let ageSystemActor = null;
   if (speaker.token) ageSystemActor = game.actors.tokens[speaker.token];
   if (!ageSystemActor ) ageSystemActor = game.actors.get(speaker.actor);
   if (ageSystemActor ) {
      let conditions = ageSystemActor .data.data.conditions;
      let abilities = ageSystemActor .data.data.abilities;
      let speed = ageSystemActor .data.data.speed;
      let origin = ageSystemActor .data.data.ancestry;
      let rolled = false;
      let flavor = {};

      let isProne = conditions.prone;
      let isFreeFalling = conditions.freefalling;
      let isInjured = conditions.injured;
      let isWounded = conditions.wounded;
      let isDying = conditions.dying;
      let isFatigued = conditions.fatigued;
      let isExhausted = conditions.exhausted;
      let isHelpless = conditions.helpless;
      let isUnconcious = conditions.unconcious;
      let consValue = abilities.cons.value;

      // Make sure this actor has their baseConValue recorded as a flag
      if (ageSystemActor.getFlag("world", "baseConValue") === undefined) {
         ageSystemActor.setFlag("world", "baseConValue", abilities.cons.value);
      } else if (abilities.cons.value > ageSystemActor.getFlag("world", "baseConValue")) {
         ageSystemActor.setFlag("world", "baseConValue", abilities.cons.value);
      }

      // Make sure this actor has their baseSpeed recorded as a flag
      if (ageSystemActor.getFlag("world", "baseSpeed") === undefined) {
         ageSystemActor.setFlag("world", "baseSpeed", speed.total);
      } else if (speed.total > ageSystemActor.getFlag("world", "baseSpeed")) {
         ageSystemActor.setFlag("world", "baseSpeed", speed.total);
      }

      if (origin === "Belter") {
         flavor1 = "Ouch! Deting hurt!";        // English: "Ouch! deting hurt!"
         flavor2 = "Dang! Deting REALLY hurt!"; // English: "Dang! deting really hurt!"
         flavor3 = "Gut by cruel world!";       // English: "Gut by cruel world!"
         // flavor4 = "tick...";                   // Same in English
         // flavor5 = "Ding! Fries are done!";     // Same in English
         flavor6 = "Im's det, Jim!";            // English: "Im's det, Jim"
      }

      // If the dying condition is currently set
      if (isDying) {
         // Every round the character will loose a point of CON until they get to -3
         if (consValue < -2) {
            ChatMessage.create({speaker: speaker, content: flavor6}); // He's dead, Jim!
         } else {
            ageSystemActor.update({"data.abilities.cons.value": (consValue - 1)});
            if (consValue < -1) {
               ChatMessage.create({speaker: speaker, content: flavor5}); // Ding! Fries are done!
            } else {
               ChatMessage.create({speaker: speaker, content: flavor4}); // tick...
            }
         }
      } else if (isWounded) {
         // Character was already wounded, set the dying condition
         // Dying characters are also unconscious, and helpless
         // Helpes characters can't move. Set the actor's speed.mod = -speed.total
         if (!isFreeFalling && !isProne) isProne = true;

         ageSystemActor.update({
            "data": {
               "conditions.dying": true,
               "conditions.unconscious": true,
               "conditions.helpless": true,
               "conditions.prone": isProne,
               "speed.total": 0,
            }
         });
         // If not freefalling, then character will also be prone
         ChatMessage.create({speaker: speaker, content: flavor3}); // Good by cruel world!
      } else if (isInjured) {
         // Character was already injured and needs to advance to wounded
         // const chatMessage = {flavor2, speaker}; // Dang! That REALLY hurt!
         flavor = flavor2;
         rolled = true;
         if (conditions.exhausted) {
            ageSystemActor.update({"data.conditions.helpless": true});
            // Set the actor's speed.mod = -speed.total
            ageSystemActor.update({"data.speed.total": 0});
         } else {
            ageSystemActor.update({"data.conditions.exhausted": true});
            // Set the actor's speed.mod = speed.mod - speed.base/2, rounding up
            ageSystemActor.update({"data.speed.total": Math.floor(ageSystemActor.getFlag("world", "baseSpeed")/2)});
         }
         // Set the wounded condition
         ageSystemActor.update({"data.conditions.wounded": true});
         // Add the exhausted condition,
         //    if already exhausted then helpless
      } else {
         // Character was uninjured prior to this damage
         flavor = flavor1;
         rolled = true;
         // Set the injured condition
         ageSystemActor.update({"data.conditions.injured": true});
         // Add the fatigued condition,
         //    if already fatigued then exhausted,
         //    if already exhausted then helpless
         if (isExhausted) {
            ageSystemActor.update({"data.conditions.helpless": true});
            // Set the actor's speed.mod = -speed.total
            ageSystemActor.update({"data.speed.total": -speed.total});
         } else if (isFatigued) {
            ageSystemActor.update({"data.conditions.exhausted": true});
            // Set the actor's speed.mod = speed.mod - speed.base/2, rounding up
            ageSystemActor.update({"data.speed.total": Math.floor(ageSystemActor.getFlag("world", "baseSpeed")/2)});
         } else {
            ageSystemActor.update({"data.conditions.fatigued": true});
         }
      }

      if (rolled) {
         // Roll 1d6 to see how much damage was bought off by taking the Wounded condition
         let roll = new Roll("1d6").roll();
         // Announce the roll
         const chatMessage = {flavor, speaker}; // Dang! That REALLY hurt!
         roll.toMessage(chatMessage);
         console.log(roll)
      }
   }
}
