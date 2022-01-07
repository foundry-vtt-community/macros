// new build for bless macro by Penguin#0949 with help from Kotetsushin#7680
// version beta 4.2.0

// user notes
// this macro is inteded for use by the recipient of the bless spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const blessIconPath = 'icons/svg/regen.svg';
let blessMsg = ' is Blessed!';
let endblessMsg = ' is no longer Blessed';

//fixed declarations DO NOT MODIFY
let macroActor = token.actor;
let chatMsg = '';
let Blessd = macroActor.effects.find(i => i.data.label === "Blessed")
let bless = {
    changes: [
        {
            key: "data.bonuses.mwak.attack",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
        {
            key: "data.bonuses.rwak.attack",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
		{
            key: "data.bonuses.msak.attack",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
		{
            key: "data.bonuses.rsak.attack",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
		{
            key: "data.bonuses.abilities.save",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
    ],
    duration: {
        seconds: 60,
    },
    icon: blessIconPath,
    label: "Blessed"
}
//identify token
if (macroActor === undefined || macroActor === null) {
  ui.notifications.warn("Please select a token first.");
} 
else {
// If already bless	
if (Blessd) {
    macroActor.deleteEmbeddedDocuments("ActiveEffect", [Blessd.id])
// anounce to chat
	chatMsg = `${macroActor.name} ${endblessMsg}`;
}
// if not already bless	
else {
    macroActor.createEmbeddedDocuments("ActiveEffect", [bless])	
// anounce to chat
		chatMsg = `${macroActor.name} ${blessMsg}`;
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
