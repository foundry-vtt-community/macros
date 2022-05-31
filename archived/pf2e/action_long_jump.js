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


            toChat(`<div><h3 style='border-bottom: 3px solid black'>Long Jump</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You Stride, then make a horizontal Leap and attempt an Athletics check to increase the length of your jump. The DC of the Athletics check is equal to the total distance in feet you're attempting to move during your Leap (so you'd need to succeed at a DC 20 check to Leap 20 feet). You can't Leap farther than your Speed.<br>

			<br>If you didn't Stride at least 10 feet, or if you attempt to jump in a different direction than your Stride, you automatically fail your check. This DC might be increased or decreased due to the situation, as determined by the GM or a taken feat.
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
            Increase the maximum horizontal distance you @Compendium[pf2e.actionspf2e.d5I6018Mci2SWokk]{Leap} to the desired distance.
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
            You Leap normally, but then fall and land @Compendium[pf2e.conditionitems.j91X7x0XSomq8d60]{Prone}.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>`)