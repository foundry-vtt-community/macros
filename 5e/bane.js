// new build for bane macro by Penguin#0949 with help from Kotetsushin#7680
// version beta 3.1.1 for workgroups

// user notes
// this macro is inteded for use by the recipient of the bane spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const baneIconPath = 'icons/svg/degen.svg';
let baneMsg = ' is Fucked!';
let endbaneMsg = ' is no longer Fucked.';

//fixed declarations DO NOT MODIFY
let Baned4 = '-1d4';
let bane = '';
let chatMsg = '';
let macroActor = actor;
let macroToken = token;

//identify token
if (macroToken === undefined || macroToken === null) {
  ui.notifications.warn("Please select a token first.");
} else {
// grab curent global states
	let mwak = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.mwak.attack));
	let rwak = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rwak.attack));
	let msak = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.msak.attack));
	let rsak = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rsak.attack));
	let abilities = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.save));
	if(mwak.includes(Baned4) && rwak.includes(Baned4) && msak.includes(Baned4) && rsak.includes(Baned4) && abilities.includes(Baned4)){
		bane = true;
	}
// If not already bane	
	if (bane == false || bane === null || bane === undefined || bane == "") {	
// toggle bane icon
		macroToken.toggleEffect(baneIconPath);  
// anounce to chat
		chatMsg = `${macroActor.name} ${baneMsg}`;
// add bane bonus
		console.log('adding bane modifiers to global bonuses');
		let obj = {};
		obj['data.bonuses.mwak.attack'] = mwak + Baned4;
		obj['data.bonuses.rwak.attack'] = rwak + Baned4;
		obj['data.bonuses.msak.attack'] = msak + Baned4;
		obj['data.bonuses.rsak.attack'] = rsak + Baned4;
		obj['data.bonuses.abilities.save'] = abilities + Baned4;
		macroActor.update(obj);
// if already bane	
	}	else if (bane == true) {
// toggle bane icon
		token.toggleEffect(baneIconPath);  		
// anounce to chat
		chatMsg = `${macroActor.name} ${endbaneMsg}`;
// remove bane bonus
		console.log('resetting global bonuses for bane');
		let obj = {};
		var tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.mwak.attack));
		var tmpLength = tmp.indexOf(Baned4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.mwak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rwak.attack));
		tmpLength = tmp.indexOf(Baned4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.rwak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.msak.attack));
		tmpLength = tmp.indexOf(Baned4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.msak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rsak.attack));
		tmpLength = tmp.indexOf(Baned4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.rsak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.save));
		tmpLength = tmp.indexOf(Baned4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.abilities.save'] = tmp;
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
