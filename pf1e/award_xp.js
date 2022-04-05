// CONFIGURATION
// If there are PCs you always want to exclude from showing on the checklist to award to, enter in "ignorePCs"
// If there are NPCs that you want to ignore awarding XP for from the combat tracker, enter in "ignoreNPCs"
const c = {
  ignorePCs: [],
  ignoreNPCs: []
};
// END CONFIGURATION

const tokens = canvas.tokens.controlled;
let actorsSelected = tokens.map(o => o.actor);
console.log(actorsSelected);
let actors = [];
if (!actors.length && c.ignorePCs.length > 0) actors = game.actors.filter(o => !c.ignorePCs.includes(o.name));
if (!actors.length) actors = game.actors.filter(o => o.hasPlayerOwner);
actors = actors.filter(o => o.testUserPermission(game.user, "OWNER") && !c.ignorePCs?.includes(o.name));

if (!actors.length) ui.notifications.warn("No applicable actor(s) found");
else {
  const _action = function(xp, checkedArray, distributed, pcCount, originalXp) {
    var targets=[];
    if (!isNaN(xp)) {
        for ( let actor of actors ) {
            for (let element of checkedArray) {
                if (element.name == actor.name){
                    targets.push(actor);
                }
            }
        }
    
        let msg = `<div class="pf1 chat-card">
                    <header class="card-header flexrow">
                        <h3 class="actor-name">${originalXp} XP Awarded</h3>
                    </header>
                    <div class="result-text">`;
        if (distributed) {
            msg += `<p style="font-size: 14px; margin: .1em 0">${originalXp} xp distributed among ${pcCount} characters (${xp} each).</p>`;
        }
        else {
            msg += `<p style="font-size: 14px; margin: .1em 0">${xp} xp each awarded to ${pcCount} characters.</p>`;
        }
        
        targets.forEach(o => {
            let curXP = getProperty(o.data, "data.details.xp.value") || 0;
            let levelXP = getProperty(o.data, "data.details.xp.max");
            if (typeof curXP === "string") curXP = parseInt(curXP);
            o.update({ "data.details.xp.value": curXP + xp });
            msg += `<p style="font-size: 14px; margin: .1em 0"><strong>${o.name}:</strong> ${curXP} xp updated to ${(curXP + xp)} (next level at ${levelXP})</p>`;
        });
        
        msg += `</div>`;
        
        ChatMessage.create({
            content: msg,
            speaker: ChatMessage.getSpeaker({alias: "XP Awarded"})
        });
    }
  };
  
  let thisCombat = game.combat?.combatants;
  let npcChecklist = "";
  let hasNPCs = false;
  let npcXpTotal = 0;
  
  if (thisCombat && thisCombat.size > 0) {
      let combatNPCs = thisCombat.filter(o => !o.actor.hasPlayerOwner && o.actor.data.type === "npc" && !c.ignoreNPCs.includes(o.actor.name));
      hasNPCs = (combatNPCs.length > 0);
      if (hasNPCs) {
          combatNPCs.forEach(combatant => {
            npcChecklist += `
                <div class="form-group">
                    <input type="checkbox" id="check${combatant.actor.name}" name="${combatant.actor.name}" value="${combatant.actor.data.data.details.xp.value}" checked class="npcXPCheckbox">
                    <label for="check${combatant.actor.name}">${combatant.actor.name} (CR ${combatant.actor.data.data.details.cr.total}, ${combatant.actor.data.data.details.xp.value} xp)</label>
                </div>`;
            npcXpTotal += combatant.actor.data.data.details.xp.value;
          });
      }
  }
  
  let checkPlayerOptions = "";
  // Build checkbox list for all active players
  actors.forEach(actor => {
    let checked = '';
    if (actor.data.type === "npc") return;
    if (actor.hasPlayerOwner) checked = 'checked';
    if (actorsSelected.length && !actorsSelected.includes(actor)) checked = '';
    checkPlayerOptions+=`
        <div class="form-group">
            <input type="checkbox" class="awardedPC" id="check${actor.name}" name="${actor.name}" value="${actor.name}" ${checked}><label for="check${actor.name}">${actor.name}</label>
        </div>`;
  });
  
  const msg = `
    Award XP to the following actors: ${checkPlayerOptions}
    <hr>Award XP for the following: 
    ${hasNPCs ? `${npcChecklist}` : ``}
    `;
  
   let xpLevels = CONFIG.PF1.CR_EXP_LEVELS.slice(1).map((o, index) => {
      let object = {xp: "", cr: 0};
      object.cr = index + 1;
      object.xp = o;
      return object;
  });
  
  xpLevels = [{cr: "1/8", xp: 50}, {cr: "1/6", xp: 65}, {cr: "1/4", xp: 100}, {cr: "1/3", xp: 135}, {cr: "1/2", xp: 200}].concat(xpLevels);
  
  const field = `
    <div class="form-group">
        <label for="crSelect">Award for CR: </label><select id="crSelect"><option value="0">Select CR</option>` + xpLevels.map(o => `<option value='${o.xp}'>${o.cr}: ${o.xp} XP</option>`) + `</select>
    </div>
    <div class="form-group">
        <label for="xpAwardEntry">Award Static XP:</label><input type="text" id="xpAwardEntry" name="xp" placeholder="XP amount" style="margin-bottom: 8px;" />
    </div>`;
  const xpDisplay = `<h3>Total XP: <span id="xpAwardTotal">${npcXpTotal}</span></h3>`;

  new Dialog({
    title: "Roll saving throw",
    content: `<form class="flexcol">${msg}${field}${xpDisplay}</form>`,
    buttons: {
      ok: {
        label: "Give All",
        callback: html => {
          let checkedArray = html.find('input[class="awardedPC"]:checked');
          let checkedCount = checkedArray.length;
          let xp = parseInt(html.find('span[id="xpAwardTotal"]')[0].innerHTML);
          _action(xp, checkedArray, false, checkedCount, xp);
        },
      },
      distribute: {
        label: "Distribute",
        callback: html => {
          let checkedArray = html.find('input[class="awardedPC"]:checked');
          let checkedCount = checkedArray.length;
          let originalXp = parseInt(html.find('span[id="xpAwardTotal"]')[0].innerHTML);
          let xp = Math.floor(originalXp / checkedCount);
          _action(xp, checkedArray, true, checkedCount, originalXp);
        }
      }
    },
    render: (htm) => {
          htm.find('.npcXPCheckbox').click(updateChecked.bind(this, htm.find('span[id="xpAwardTotal"]'), htm.find('input[id="xpAwardEntry"]')));
          htm.find('#xpAwardEntry').on('input', updateValue.bind(this, htm.find('span[id="xpAwardTotal"]'), htm.find('input[id="xpAwardEntry"]')));
          htm.find('#crSelect').on('change', updateValue.bind(this, htm.find('span[id="xpAwardTotal"]'), htm.find('select[id="crSelect"]')));
      },
  }).render(true);

  let updateChecked = function(xpSpan, xpInput, event) {
    let checkbox = event.target;
    npcXpTotal = checkbox.checked ? (npcXpTotal + parseInt(checkbox.value)) : (npcXpTotal - parseInt(checkbox.value));
    
    let inputXP = parseInt(xpInput.val());
    if (isNaN(inputXP)) inputXP = 0;
    let newXP = npcXpTotal + inputXP;
    xpSpan[0].innerHTML = newXP;
  };
  
  let updateValue = function(xpSpan, xpInput, event) {
      console.log(xpInput.val());
    let inputXP = parseInt(xpInput.val());
    if (isNaN(inputXP)) inputXP = 0;
    let newXP = npcXpTotal + inputXP;
    xpSpan[0].innerHTML = newXP;
  };
  
}
