// new build for guidance macro by Mr.White and Penguin#0949 and with no help all of Kotetsushin#7680 trust me 
// Edited by DrWiFi to roll guidance on skill checks as well, removed references to bless spell
// version beta 3.1.1 for workgroups .2

// user notes
// this macro is intended for use by the recipient of the guidance spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independently on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const guidanceIconPath = 'icons/svg/windmill.svg';
let guidanceMsg = ' is guided!';
let endguidanceMsg = ' is no longer guided.';

//fixed declarations DO NOT MODIFY
let Guidd4 = '+1d4';
let guided = '';
let chatMsg = '';
let macroActor = actor;
let macroToken = token;

//identify token
if (macroToken === undefined || macroToken === null) {
  ui.notifications.warn("Please select a token first.");
} else {
// grab curent global states
	let abilities = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.check));
	let skills = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.skill));
	if(abilities.includes(Guidd4)){
		guided = true;
	}
// If not already guided	
	if (guided == false || guided === null || guided === undefined || guided == "") {	
// toggle guidance icon
		macroToken.toggleEffect(guidanceIconPath);  
// anounce to chat
		chatMsg = `${macroActor.name} ${guidanceMsg}`;
// add guidance bonus
		console.log('adding guidance modifiers to global bonuses');
		let obj = {};
		obj['data.bonuses.abilities.check'] = abilities + Guidd4;
		obj['data.bonuses.abilities.skill'] = skills + Guidd4;
		macroActor.update(obj);
// if already guided	
	}	else if (guided == true) {
// toggle guidance icon
		token.toggleEffect(guidanceIconPath);  		
// anounce to chat
		chatMsg = `${macroActor.name} ${endguidanceMsg}`;
// remove guidance bonus
		console.log('resetting global bonuses for guidance');
		let obj = {};
		var tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.check));
		var tmpLength = tmp.indexOf(Guidd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.abilities.check'] = tmp;
		var tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.skill));
		var tmpLength = tmp.indexOf(Guidd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.abilities.skill'] = tmp;
		macroActor.update(obj);
	}
}
  	
// write to chat if needed:
if (chatMsg !== '') {
	let chatData = {
		user: game.user._id,
		speaker: ChatMessage.getSpeaker(),
		content: chatMsg
	};
	ChatMessage.create(chatData, {});
}
