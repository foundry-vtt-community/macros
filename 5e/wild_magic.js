function printMessage(message){
        let chatData = {
                user : game.user._id,
                content : message,
                blind: true,
                whisper : game.users.entities.filter(u => u.isGM).map(u => u._id)
        };

        ChatMessage.create(chatData,{});        
}


const roll = new Roll(`1d20`);
let result = roll.roll();

if (result.results[0] == 1) {
    printMessage('<p style="color:red;">Wild magic has been triggered.</p>');
}
else{
    printMessage("Wild magic was not triggered on a " + result.results[0]);
}