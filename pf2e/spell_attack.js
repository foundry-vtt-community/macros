//Spell Attack: This rolls the spell attack for any "Spontaneous Primal Spells". 
   //Replace the name with whatever the name of your Spellcasting Entry is in your spellbook to roll that spell attack.

let name = 'Spontaneous Primal Spells';

let modifier = (actor.data.items).find(item => item.name
 == name).data.spelldc.value;

const roll = new Roll('1d20+' + modifier);

roll.roll();

roll.toMessage({ flavor: "Spell Attack", speaker: ChatMessage.getSpeaker({actor: actor})});
