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


            toChat(`<div><h3 style='border-bottom: 3px solid black'>Climb</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You move up, down, or across an incline. Unless it's particularly easy, you must attempt an Athletics check. The GM determines the DC based on the nature of the incline and environmental circumstances. You're @Compendium[pf2e.conditionitems.AJh5ex99aV6VTggg]{Flat-Footed} unless you have a climb Speed.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>💥 Crit Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You move up, across, or safely down the incline for 5 feet plus 5 feet per 20 feet of your land Speed (a total of 10 feet for most PCs).
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>✔️ Success!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You move up, across, or safely down the incline for 5 feet per 20 feet of your land Speed (a total of 5 feet for most PCs, minimum 5 feet if your Speed is below 20 feet).
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>❌ Crit Fail!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            You fall. If you began the climb on stable ground, you fall and land @Compendium[pf2e.conditionitems.j91X7x0XSomq8d60]{Prone}.
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>
            <div><h3 style='border-bottom: 3px solid black'>Skill Rank Requirements!</h3></div>
            <div style="color:#131516;margin-top:4px;">
            Untrained: ladder, steep slope, low-branched tree

<br>            Trained: rigging, rope, typical tree

<br>            Expert: a wall with small handholds and footholds

<br>            Master: ceiling with handholds and footholds, rock wall
            
<br>Legendary: smooth surface
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>`)