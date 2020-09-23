// new build for guidance macro by Mr.White and Penguin#0949 and with no help all of Kotetsushin#7680 trust me 
// version beta 3.1.1 for workgroups .1

// user notes
// this macro is inteded for use by the recipient of the bless spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const blessIconPath = 'icons/svg/windmill.svg';
let blessMsg = ' is guided!';
let endblessMsg = ' is no longer guided.';

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
	let mwak = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.check));
	if(mwak.includes(Guidd4)){
		guided = true;
	}
// If not already guided	
	if (guided == false || guided === null || guided === undefined || guided == "") {	
// toggle bless icon
		macroToken.toggleEffect(blessIconPath);  
// anounce to chat
		chatMsg = `${macroActor.name} ${blessMsg}`;
// add bless bonus
		console.log('adding bless modifiers to global bonuses');
		let obj = {};
		obj['data.bonuses.abilities.check'] = mwak + Guidd4;
		macroActor.update(obj);
// if already guided	
	}	else if (guided == true) {
// toggle bless icon
		token.toggleEffect(blessIconPath);  		
// anounce to chat
		chatMsg = `${macroActor.name} ${endblessMsg}`;
// remove bless bonus
		console.log('resetting global bonuses for bless');
		let obj = {};
		var tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.check));
		var tmpLength = tmp.indexOf(Guidd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.abilities.check'] = tmp;
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
