/**
 * Roll/Reroll selected token HP
 * Author: Tielc#7191
 */

const tokens = canvas.tokens.controlled;
let choice = 0;

if (tokens.length > 0){
	tokens.forEach(rollHP);
} else {
	printMessage("No Tokens were selected");
}

function rollHP(token, index){
	let actor = token.actor;
	let formula = actor.data.data.attributes.hp.formula;
		
	if (actor.data.type != "npc" || !formula) return;
	
	let hp = new Roll(formula).roll().total;
	
	actor.data.data.attributes.hp.value = hp;
	actor.data.data.attributes.hp.max = hp;
	
	printMessage('<h2>' + actor.data.name + '</h2><strong>HP:</strong> ' + actor.data.data.attributes.hp.value + '/' + actor.data.data.attributes.hp.max + '<span style="float:right"><em>(' + token.data._id + ')</em></span>');
}

function printMessage(message){
	let chatData = {
		user : game.user._id,
		content : message,
		blind: true,
		whisper : game.users.entities.filter(u => u.isGM).map(u => u._id)
	};

	ChatMessage.create(chatData,{});	
}
