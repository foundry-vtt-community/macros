function printMessage(message){
        let chatData = {
                user : game.user.id,
                content : message,
                blind: true,
                whisper : game.users.filter(u => u.isGM).map(u => u.id)
        };

        ChatMessage.create(chatData,{});        
}


const roll = new Roll(`1d20`);
let result = await roll.roll();

if (result.total == 1) {
    printMessage('<p style="color:red;">Wild magic has been triggered.</p>');
}
else{
    printMessage("Wild magic was not triggered on a " + result.total);
}