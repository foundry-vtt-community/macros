// new build for bless macro by Penguin#0949 with help from Kotetsushin#7680
// version beta 3.1.1 for workgroups

// user notes
// this macro is inteded for use by the recipient of the bless spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const blessIconPath = 'icons/svg/regen.svg';
let blessMsg = ' is Blessed!';
let endblessMsg = ' is no longer Blessed.';

//fixed declarations DO NOT MODIFY
let Blessd4 = '+1d4';
let bless = '';
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
	if(mwak.includes(Blessd4) && rwak.includes(Blessd4) && msak.includes(Blessd4) && rsak.includes(Blessd4) && abilities.includes(Blessd4)){
		bless = true;
	}
// If not already bless	
	if (bless == false || bless === null || bless === undefined || bless == "") {	
// toggle bless icon
		macroToken.toggleEffect(blessIconPath);  
// anounce to chat
		chatMsg = `${macroActor.name} ${blessMsg}`;
// add bless bonus
		console.log('adding bless modifiers to global bonuses');
		let obj = {};
		obj['data.bonuses.mwak.attack'] = mwak + Blessd4;
		obj['data.bonuses.rwak.attack'] = rwak + Blessd4;
		obj['data.bonuses.msak.attack'] = msak + Blessd4;
		obj['data.bonuses.rsak.attack'] = rsak + Blessd4;
		obj['data.bonuses.abilities.save'] = abilities + Blessd4;
		macroActor.update(obj);
// if already bless	
	}	else if (bless == true) {
// toggle bless icon
		token.toggleEffect(blessIconPath);  		
// anounce to chat
		chatMsg = `${macroActor.name} ${endblessMsg}`;
// remove bless bonus
		console.log('resetting global bonuses for bless');
		let obj = {};
		var tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.mwak.attack));
		var tmpLength = tmp.indexOf(Blessd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.mwak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rwak.attack));
		tmpLength = tmp.indexOf(Blessd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.rwak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.msak.attack));
		tmpLength = tmp.indexOf(Blessd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.msak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.rsak.attack));
		tmpLength = tmp.indexOf(Blessd4);
        tmp = tmp.substring(0, tmpLength) + tmp.substring(tmpLength+4, tmp.length);
		obj['data.bonuses.rsak.attack'] = tmp;
		tmp = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.abilities.save));
		tmpLength = tmp.indexOf(Blessd4);
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
