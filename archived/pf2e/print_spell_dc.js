//Spell DC: This will print to the chat the spell DC. 
  //Replace the name with your character's Spellcasting Entry.

let name = 'Spontaneous Primal Spells';

let dc= (actor.data.items).find(item => item.name
 == name).data.spelldc.dc;

let string = 'DC is ' + dc;

ChatMessage.create({content: string, speaker: ChatMessage.getSpeaker({actor: actor})});
