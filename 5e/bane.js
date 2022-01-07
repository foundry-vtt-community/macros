// new build for Bane macro by Penguin#0949 with help from Kotetsushin#7680
// version beta 4.2.0

// user notes
// this macro is inteded for use by the recipient of the Bane spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const baneIconPath = 'icons/svg/degen.svg';
let baneMsg = ' is Baned!';
let endbaneMsg = ' is no longer Baned.';

//fixed declarations DO NOT MODIFY
let macroActor = token.actor;
let chatMsg = '';
let Baned = macroActor.effects.find(i => i.data.label === "Baned")
let bane = {
    changes: [
        {
            key: "data.bonuses.mwak.attack",
            mode: 2,
            priority: 20,
            value: "-1d4",
        },
        {
            key: "data.bonuses.rwak.attack",
            mode: 2,
            priority: 20,
            value: "-1d4",
        },
		{
            key: "data.bonuses.msak.attack",
            mode: 2,
            priority: 20,
            value: "-1d4",
        },
		{
            key: "mdata.bonuses.rsak.attack",
            mode: 2,
            priority: 20,
            value: "-1d4",
        },
		{
            key: "data.bonuses.abilities.save",
            mode: 2,
            priority: 20,
            value: "-1d4",
        },
    ],
    duration: {
        seconds: 60,
    },
    icon: baneIconPath,
    label: "Baned"
}
//identify token
if (macroActor === undefined || macroActor === null) {
  ui.notifications.warn("Please select a token first.");
} 
else {
// If already bless	
if (Baned) {
    macroActor.deleteEmbeddedDocuments("ActiveEffect", [Baned.id])
// anounce to chat
	chatMsg = `${macroActor.name} ${endbaneMsg}`;
}
// if not already bless	
else {
    macroActor.createEmbeddedDocuments("ActiveEffect", [bane])	
// anounce to chat
		chatMsg = `${macroActor.name} ${baneMsg}`;
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
}
