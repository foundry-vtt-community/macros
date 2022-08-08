if (canvas.tokens.controlled == 0) {
  ui.notifications.warn("You must select a token.");
  return
}

actor.data.data.skills.ath.roll(event);

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


            toChat(`<div><h3 style='border-bottom: 3px solid black'>Force Open</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You attempt to forcefully open a door, window, container or heavy gate. With a high enough result, you can even smash through walls. Without a crowbar, prying something open takes a -2 item penalty to Athletics.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>💥 Crit Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You open the door, window, container, or gate and can avoid damaging it in the process.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>✔️ Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You break the door, window, container, or gate open, and it gains the broken condition. If it's especially sturdy, the GM might have it take damage but not be broken.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>❌ Crit Fail!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            Your attempt jams the door, window, container, or gate shut, imposing a -2 circumstance penalty on future attempts to Force it Open.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>Skill Rank Requirements!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            Untrained: fabric, flimsy glass<br>
            Trained: ice, sturdy glass<br>
            Expert: flimsy wooden door, wooden portcullis<br>
            Master: sturdy wooden door, iron portcullis, metal bar<br>
            Legendary: stone or iron door
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>`)