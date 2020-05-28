/**
 * Equips or unequips an item named 'Shield'. Then updates the character's AC.
 * Author: ^ and stick#0520
 */

let charData = game.user.character;
let shield = charData.items.find(i => i.name == 'Shield');

if (shield != null)
{
   let item = game.user.character.getOwnedItem(shield._id);
   let attr = "data.equipped";
   item.update({[attr]: !getProperty(item.data, attr)});

   if (getProperty(item.data, attr)) {
      charData.update({"data.attributes.ac.value": charData.data.data.attributes.ac.value-2});
   } else {
      charData.update({"data.attributes.ac.value": charData.data.data.attributes.ac.value+2});
   }
}
