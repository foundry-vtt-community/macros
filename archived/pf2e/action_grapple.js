const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);
const options = ['all', 'skill-check', 'athletics', 'grapple']


if (canvas.tokens.controlled == 0) {
  ui.notifications.warn("You must select a token.");
  return
}

if (game.user.targets.size == 0) {
  ui.notifications.warn("You must have a target.");
  return
}


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

game.user.targets.forEach(t => {

    token.actor.data.data.skills.ath.roll(event, options, (result) => {
        let roll = result._total;
        let crit = handleCrits(result.parts[0].rolls[0].result);
        let fortitudeDC = 10 + t.actor.data.data.saves.fortitude.totalModifier

        if (roll + crit >= fortitudeDC + 10) {
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Grapple</h3></div><div style="color:#131516;margin-top:4px;">
            💥 <b>Crit Success! 
             <br> <b>${t.name}:</b>   Your opponent is restrained (if they were already restrained or grappled they are now considered restrained) until the end of your next turn unless you move or your opponent Escapes (page 470).
               
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit >= fortitudeDC) {
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Grapple</h3></div><div style="color:#131516;margin-top:4px;">
            ✔️ <b>Success! 
             <br> <b>${t.name}:</b>  Your opponent is grabbed (if they were already restrained or grappled they are now considered grabbed) until the end of your next turn unless you move or your opponent Escapes.
                 
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit < fortitudeDC - 10) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Grapple</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Crit Fail! 
             <br> <b>${t.name}:</b> If you already had the opponent grabbed or restrained, it breaks free. Your target can either grab you, as if it succeeded at using the Grapple action against you, or force you to fall and land prone.               
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit < fortitudeDC) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Grapple</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Fail! 
             <br> <b>${t.name}:</b>  You fail to grab your opponent. If you already had the opponent grabbed or restrained using a Grapple, those conditions on that creature end.            
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)
        }

    })

})