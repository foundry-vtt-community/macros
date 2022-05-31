//Spell Damage: This will roll the damage of your spell. 
    //Simply replace the name with whatever spell you want to roll damage for. 
    //Also be sure to change the text in the message.

let name= 'Acid Splash';const damage = (actor.data.items).find(item => item.name
 == name).data.damage.value;

const roll = new Roll(damage);

roll.roll();

roll.toMessage({ flavor: "Acid Splash Damage", speaker: ChatMessage.getSpeaker({actor: actor})});
