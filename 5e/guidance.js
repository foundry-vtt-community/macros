// new build for guidance macro by Mr.White and Penguin#0949 and with no help all of Kotetsushin#7680 trust me 
// version beta 4.2.0

// user notes
// this macro is inteded for use by the recipient of the bless spell in D&D 5e on Forge VTT
// N.B. every recipient will need to use this macro independantly on their own Actor/token.

//user modifiable declarations CHANGE AT YOUR OWN RISK
const GuidIconPath = 'icons/svg/windmill.svg';
let GuideMsg = ' is guided!';
let endGuideMsg = ' is no longer guided.';

//fixed declarations DO NOT MODIFY
let chatMsg = '';
let macroActor = token.actor;
let Guided = macroActor.effects.find(i => i.data.label === "Guided")
let Guide = {
    changes: [
        {
            key: "data.bonuses.abilities.check",
            mode: 2,
            priority: 20,
            value: "+1d4",
        },
    ],
    duration: {
        seconds: 60,
    },
    icon: GuidIconPath,
    label: "Guided"
}
//identify token
if (macroActor === undefined || macroActor === null) {
    ui.notifications.warn("Please select a token first.");
}
else {
// If already guided	
    if (Guided) {
        macroActor.deleteEmbeddedDocuments("ActiveEffect", [Guided.id]);
        // anounce to chat
        chatMsg = `${macroActor.name} ${endGuideMsg}`;
    }
    // if not already guided	
    else {
        macroActor.createEmbeddedDocuments("ActiveEffect", [Guide]);
        // anounce to chat
        chatMsg = `${macroActor.name} ${GuideMsg}`;
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
