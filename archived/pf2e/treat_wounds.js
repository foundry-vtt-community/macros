/* This is a script that automates the Treat Wounds or Battle Medicine skill. It returns 3 (or 2) chat messages:
    1. A shout-out
    2. The result of the medicine check
    3. The result according to the degree of succes of the medicine check (no message if the check is a failure)
  
  You can use key combinations for different DC's, which will also add the bonus healing corresponding to that DC. 
  The key combinations are:
    - normal click for Trained DC
    - ctrl-click for Expert DC
    - alt-click for Master DC
    - ctrl-alt-click for Legendary DC
  For example, if you use ctrl-click, you will roll a med check for the Expert DC (20) and, if you will succed, you will add a bonus healing of 10 to the 2d8 roll.
  
  For this to work, you need to have your character token selected.
*/


// Variables used for different DC's

let bonusheal = 0;
let dc_text = " - Trained DC (15)";
let dc_value = 0;


// Flavor text that will be displayed in the chat box. You can change the text according to your own will, be creative and have fun!

let Shoutout_flavor_msg = "I will try to heal you!";
let Success_flavor_msg = "Success!";
let CritSuccess_flavor_msg = "Outstanding Success!";
let Failure_flavor_msg = "Failure...";
let CritFailure_flavor_msg = "Or maybe... I'll be the one to kill you";
let Heal_flavor_msg = "You shall heal for:";
let Dmg_flavor_msg = "You will take this damage:";


// Here the DC variables will be changed according to which key combinations you use

if(event.ctrlKey && event.altKey == true) {
  bonusheal = 50;
  dc_text = " - Legendary DC (40)";
  dc_value = 25;
} else if(event.ctrlKey) {
  bonusheal = 10;
  dc_text = " - Expert DC (20)";
  dc_value = 5;
} else if(event.altKey) {
  bonusheal = 30;
  dc_text = " - Master DC (30)";
  dc_value = 15;
}


// Declaring the dice rolls

let r1 = new Roll("1d20+@skills.med.value", token.actor.getRollData());
let r2 = new Roll('2d8+@bonusheal', {bonusheal});
let r3 = new Roll('4d8+@bonusheal', {bonusheal});
let r4 = new Roll("1d8");


// Shout-out your intention to heal

ChatMessage.create({content: Shoutout_flavor_msg+dc_text, speaker: ChatMessage.getSpeaker({actor: actor})});


// Rolling the medicine check

r1.roll();
let a = r1.total;


// Comparing the medicine check with the DC and returning the corresponding result

if(a>14+dc_value) { 
  if(a-token.actor.data.data.skills.med.value==1) {
    if (a-10>14+dc_value) {
      r1.toMessage({
        flavor: Success_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
      r2.roll();
      r2.toMessage({
        flavor: Heal_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
    } else {
      r1.toMessage({
        flavor: Failure_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
       });
      }
  } else if(a-10>14+dc_value || a-token.actor.data.data.skills.med.value == 20) { 
      r1.toMessage({
        flavor: CritSuccess_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
      r3.roll();
      r3.toMessage({
        flavor: Heal_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
  } else {
        r1.toMessage({
          flavor: Success_flavor_msg,
          speaker: ChatMessage.getSpeaker({token: token}),
        });
        r2.roll();
        r2.toMessage({
          flavor: Heal_flavor_msg,
          speaker: ChatMessage.getSpeaker({token: token}),
        });
      }
} else if(a<15+dc_value) {
    if (a+10<15+dc_value || a-token.actor.data.data.skills.med.value==1) {
      r1.toMessage({
        flavor: CritFailure_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
      r4.roll();
      r4.toMessage({
        flavor: Dmg_flavor_msg,
        speaker: ChatMessage.getSpeaker({token: token}),
      });
    } else {
         r1.toMessage({
          flavor: Failure_flavor_msg,
          speaker: ChatMessage.getSpeaker({token: token}),
         });
        }
}
