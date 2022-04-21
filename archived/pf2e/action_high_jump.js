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


            toChat(`<div><h3 style='border-bottom: 3px solid black'>High Jump</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You Stride, then make a vertical Leap and attempt a DC 30 Athletics check to increase the height of your jump. If you didn't Stride at least 10 feet, you automatically fail your check. This DC might be increased or decreased due to the situation, as determined by the GM.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>💥 Crit Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            Increase the maximum vertical distance to 8 feet, or increase the maximum vertical distance to 5 feet and maximum horizontal distance to 10 feet.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>✔️ Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            Increase the maximum vertical distance to 5 feet.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>❌ Fail!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You Leap normally.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>❌ Crit Fail!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You don't Leap at all, and instead you fall @Compendium[pf2e.conditionitems.j91X7x0XSomq8d60]{Prone} in your space.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>`)