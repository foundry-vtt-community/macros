/**
 * Equips/unequips an item. Make sure you change the variables at the top (as required).
 * This script will also error check to make sure items exist and tokens are select. 
 * Chat and token icon display options can be set as desired.
 * Author: Zapgun
 */

let itemName = 'Shield'; // <--- Change this to the *exact* item name (capitals count!)
let sendToChat = true; // <--- Change to 'true' or 'false' to display a chat message about equipping
let displayIcon = true; // <--- Change to 'true' or 'false' to display an effect icon when equipped
const effectIconPath = 'icons/svg/shield.svg'; // <--- Add the effect icon you want to appear when equipped

let toggleResult = false;

if (!actor) {
    ui.notifications.warn('You need to select a token before using this macro!');
} else {

	let myItem = actor.items.find(i => i.name == itemName);
	if (myItem != null)
	{
		let item = actor.getOwnedItem(myItem._id);
		let attr = "data.equipped";
		let equipped = getProperty(item.data, attr);
		if (sendToChat) {			
			if (!equipped) {
				chatMessage(actor.name + ' <b>equips</b> their <i>' + ' ' + itemName+ '</i>');
			} else {
				chatMessage(actor.name + ' <b>un-equips</b> their <i>' + ' ' + itemName + '</i>');			
			}
		}
		item.update({[attr]: !getProperty(item.data, attr)});
		
		// mark/unmark character's token with an effect icon when displayToken is true
		(async () => { 
			if (displayIcon) {
				toggleResult = await token.toggleEffect(effectIconPath);
				if (toggleResult == equipped) token.toggleEffect(effectIconPath);  
			}
		})();
		
	} else {
		ui.notifications.warn("No item named '" + itemName + "' found on character!");
	}
}

function chatMessage(messageContent) {
	// create the message
	if (messageContent !== '') {
		let chatData = {
			user: game.user._id,
			speaker: ChatMessage.getSpeaker(),
			content: messageContent,
		};
		ChatMessage.create(chatData, {});
	}
}