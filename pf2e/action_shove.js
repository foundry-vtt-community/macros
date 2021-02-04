const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);
const options = ['all', 'skill-check', 'athletics', 'shove']


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
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Shove</h3></div><div style="color:#131516;margin-top:4px;">
            💥 <b>Crit Success! 
             <br> <b>${t.name}:</b>   You push your opponent up to 10 feet away from you. You can Stride after it, but you must move the same distance and in the same direction.
               
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit >= fortitudeDC) {
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Shove</h3></div><div style="color:#131516;margin-top:4px;">
            ✔️ <b>Success! 
             <br> <b>${t.name}:</b>  You push your opponent back 5 feet. You can Stride after it, but you must move the same distance and in the same direction.
                 
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit < fortitudeDC - 10) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Shove</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Crit Fail! 
             <br> <b>${t.name}:</b> You lose your balance, fall, and land prone.               
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit < fortitudeDC) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Shove</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Fail! 
             <br> <b>${t.name}:</b>  Your action fails to shove the target.            
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)
        }

    })

})