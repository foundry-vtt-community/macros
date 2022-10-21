if (canvas.tokens.controlled == 0) {
  ui.notifications.warn("You must select a token.");
  return
}

actor.data.data.skills.ste.roll(event);

////////////// To chat message data /////////////////

let toChat = (content) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }

    ChatMessage.create(chatData, {})
}

//////////// To chat message data //////////////////


            toChat(`<div><h3 style='border-bottom: 3px solid black'>Conceal an Object</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You hide a small object on your person (such as a weapon of light Bulk). When you try to sneak a concealed object past someone who might notice it, the GM rolls your Stealth check and compares it to this passive observer's <b>Perception DC</b>. 
            <br>You can also conceal an object somewhere other than your person, such as among undergrowth or in a secret compartment within a piece of furniture. In this case, characters Seeking in an area compare their Perception check results to your Stealth DC to determine whether they find the object.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>✔️ Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            The object remains undetected.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>❌ Fail!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            The searcher finds the object.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>`)