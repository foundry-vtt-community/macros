/**
 * Equips/unequips an item. Make sure you change the variables at the top (as required).
 */

let itemName = 'Shield'; // <--- Change this to the *exact* item name (capitals count!)
let sendToChat = true; // <--- Change to 'true' or 'false' to display a chat message about equipping

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