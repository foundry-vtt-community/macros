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

async function rollHP(token, index){
	let actor = token.actor;
	let formula = actor.data.data.attributes.hp.formula;
		
	if (actor.data.type != "npc" || !formula) return;
	
	let hp = (await new Roll(formula).roll()).total;
	
	await actor.update({"data.attributes.hp.value": hp, "data.attributes.hp.max": hp});
	
	printMessage('<h2>' + actor.data.name + '</h2><strong>HP:</strong> ' + actor.data.data.attributes.hp.value + '/' + actor.data.data.attributes.hp.max + '<span style="float:right"><em>(' + token.data._id + ')</em></span>');
}

function printMessage(message){
	let chatData = {
		user : game.user._id,
		content : message,
		blind: true,
		whisper : game.users.filter(u => u.isGM).map(u => u.id)
	};

	ChatMessage.create(chatData,{});	
}