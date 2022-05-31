const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);
const options = ['all', 'skill-check', "intimidation", 'demoralize']

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

    token.actor.data.data.skills.itm.roll(event, options, (result) => {
        let roll = result._total;
        let crit = handleCrits(result.parts[0].rolls[0].result);
        let willDC = 10 + t.actor.data.data.saves.will.totalModifier

        if (roll + crit >= willDC + 10) {
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Demoralize</h3></div><div style="color:#131516;margin-top:4px;">
            💥 <b>Crit Success! 
             <br> <b>${t.name}:</b>  becomes Frightened 2!                  
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)
            addAlert(t, 2)
        } else if (roll + crit >= willDC) {
            toChat(`<div><h3 style='border-bottom: 3px solid black'>Demoralize</h3></div><div style="color:#131516;margin-top:4px;">
            ✔️ <b>Success! 
             <br> <b>${t.name}:</b>  becomes Frightened 1!                  
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)
            addAlert(t, 1)
        } else if (roll + crit < willDC - 10) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Demoralize</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Crit Fail! 
             <br> <b>${t.name}:</b> unaffected                
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)

        } else if (roll + crit < willDC) {

            toChat(`<div><h3 style='border-bottom: 3px solid black'>Demoralize</h3></div><div style="color:#131516;margin-top:4px;">
            ❌ <b>Fail! 
             <br> <b>${t.name}:</b>  unaffected                
            <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
            <b style="color:#990000">
            </div>  `)
        }
})

})