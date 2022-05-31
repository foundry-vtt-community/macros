  let applyChanges = false;
    let clearDamage = false
  let template = `
    <form>
    <div class="form-group">
        <label>Persistent Damage:</label>
        <select id="damage_type" name="damage_type">
          <option value="nochange">No Change</option>
<option value="bleeding">Bleeding</option>
		  <option value="fire">Fire</option>
		  <option value="acid">Acid</option>
		  <option value="cold">Cold</option>
		  <option value="electricity">Electricity</option>
		  <option value="mental">Mental</option>
		  <option value="poison">Poison</option>
		 </select>
      </div>
    <div class='form-group'>
       <label>Damage:</label>
       <div class='form-fields'><input type="text" id="damage"/></div>
    </div>
    </form>
    `;

  new Dialog({
    title: "Persistent Damage",
    content: `<style>
      #pf2-template-creator header {
        border-radius: 0;
        background: linear-gradient(90deg, var(--secondary) 0%, #202b93 50%, var(--secondary) 100%);
        border: none;
        box-shadow: inset 0 0 0 1px #9f725b,inset 0 0 0 2px var(--tertiary),inset 0 0 0 3px #956d58;
        margin-bottom: 2px;
        font-size: .75rem;
      }
#pf2-template-creator .window-content {
        background-size: cover;
        padding: 9px;
        background-origin: border-box;
        color: #000;
        border-width: 9px;
        border-image: url(systems/pf2e/assets/sheet/corner-box.png) 9 repeat;
        border-style: solid;
        border-image-outset: 0;
      }
      #pf2-template-creator form {
        margin-bottom: 20px;
      }
      #pf2-template-creator .form-fields.buttons {
        justify-content: flex-start !important;
      }
      #pf2-template-creator .button {
        flex: 1 !important;
        border-width: 9px;
        border-image: url(systems/pf2e/assets/sheet/corner-box.png) 9 repeat;
        font-size: 12px;
        padding: 0;
        background: linear-gradient(90deg, var(--secondary) 0%, #202b93 50%, var(--secondary) 100%);
        color: #fff;
        cursor: pointer;
      }

      #pf2-template-creator .button:hover {
        box-shadow: 0 0 8px black;
      }
      #pf2-template-creator .radios input[type="radio"] {
        opacity: 0;
        position: fixed;
        width: 0;
      }
      #pf2-template-creator .radios label {
        cursor: pointer;
        display: flex;
        flex: 1 !important;
        margin: -2px 0;
        background: rgba(0, 0, 0, 0.1);
        border: 2px groove #f0f0e0;
        width: 100%;
        border-radius: 3px;
        font-size: 13px;
        font-family: "Signika", sans-serif;
        justify-content: center;
        align-items: center;
        background: #171f69;
        color: #fff;
        border-width: 9px;
        border-image: url(systems/pf2e/assets/sheet/corner-box.png) 9 repeat;
      }
      #pf2-template-creator .radios label i {
        margin-right: 5px;
        color: #fff;
        background: #171f69;
      }
      #pf2-template-creator .radios label:hover {
        box-shadow: 0 0 8px black;
      }
      #pf2-template-creator .radios input[type="radio"]:checked + label {
        background: #212121;
      }
      #pf2-template-creator .dialog-button {
        height: 50px;
        background: linear-gradient(90deg, var(--secondary) 0%, #202b93 50%, var(--secondary) 100%);
        border-image: url(systems/pf2e/assets/sheet/corner-box.png) 9 repeat;
        color: #fff;
        border-width: 9px;
        display: inline-flex;
        justify-content: space-evenly;
        align-items: center;
        cursor: pointer;
      }
      #pf2-template-creator .dialog-button:hover {
        box-shadow: 0 0 8px black;
      }
      #pf2-template-creator .notes {
        color: #000 !important;
        flex: 0 0 100% !important;
        font-size: 12px !important;
        line-height: 16px !important;
        margin: 10px 0 5px 0 !important;
      }
      #pf2-template-creator .notes.title {
        border-bottom: 1px solid #000;
        font-size: 14px !important;
        font-weight: bold;
        margin: 10px 0 10px 0 !important;
      }
      #pf2-template-creator .notes.toptitle {
        font-size: 14px !important;
        font-weight: bold;
        margin: 0px 0 10px 0 !important;
      }
    </style>` + template,
    buttons: {
      ok: {
        icon: "<i class='fas fa-check'></i>",
        label: "Apply",
        callback: () => applyChanges = true
      },
    cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel",
      },
      clear: {
        icon: "<i class='fas fa-skull'></i>",
        label: "Clear",
        callback: () => clearDamage = true
      },
    },
default: "yes",
  close: html => {
    if (applyChanges) {
						
		if (damage_type.value == "bleeding"){
		    addAlerts(document.getElementById("damage").value, "bleeding");
		    token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/bleeding.png");
		}
		if (damage_type.value == "fire"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/fire.png");
			addAlerts(document.getElementById("damage").value, "fire");
		}
		if (damage_type.value == "acid"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/acid.png");
			addAlerts(document.getElementById("damage").value, "acid");
		}
		if (damage_type.value == "cold"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/cold.png");
			addAlerts(document.getElementById("damage").value, "cold");
		}
		if (damage_type.value == "electricity"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/electricity.png");
			addAlerts(document.getElementById("damage").value, "electricity");
		}
		if (damage_type.value == "mental"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/mental.png");
			addAlerts(document.getElementById("damage").value, "mental");
		}
		if (damage_type.value == "poison"){
			token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/poison.png");
			addAlerts(document.getElementById("damage").value, "poison");
		}
		
	}
	if (clearDamage) {
	    if (damage_type.value == "bleeding"){
	        if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/bleeding.png")) {
	            token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/bleeding.png");
	            deleteAlert("bleeding",`${token.name}`)
	        }
	    }
	    if (damage_type.value == "fire"){
			if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/fire.png")) {
			    token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/fire.png");
			    deleteAlert("fire",`${token.name}`)
			}
		}
		if (damage_type.value == "acid"){
	        if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/acid.png")) {
			    token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/acid.png");
			    deleteAlert("acid",`${token.name}`)
	        }
		}
		if (damage_type.value == "cold"){
	        if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/cold.png")) {
			    token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/cold.png");
			    deleteAlert("cold",`${token.name}`)
	        }
		}
		if (damage_type.value == "electricity"){
		    if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/electricity.png")) {
	    	    token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/electricity.png");
			    deleteAlert("electricity",`${token.name}`)
		    }
		}
		if (damage_type.value == "mental"){
		    if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/mental.png")) {
		        token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/mental.png");
			    deleteAlert("mental",`${token.name}`)
		    }
		}
		if (damage_type.value == "poison"){
		    if (token.data.effects.includes("Homebrew/04.%20Icons/02.%20Conditions/damage/poison.png")) {
		        token.toggleEffect("Homebrew/04.%20Icons/02.%20Conditions/damage/poison.png");
			    deleteAlert("poison",`${token.name}`)
		    }
		}
	    
	}
}

  },{
    id: 'pf2-template-creator'
    }).render(true);


function addAlerts(damage, type) {
    if (!game.combat) {
  ui.notifications.warn("No combat currently active.")
  return
} 
  
  canvas.tokens.controlled.forEach(t => {
    addAlert(damage, type, t);
  });
}

function addAlert(damage, type, t) {
  const text = t.data.name + " takes [[/r " + damage + "#"+type+" damage]] persistent " + type + " damage.<br/>Roll DC 15 Flat check, [[/r 1d20 #flat check vs DC 15]]";
  const text2 = t.data.name + " is taking persistent " + type + " damage.";
  const combatData = game.combat.data;
  const alertData = {
    combatId: combatData._id,
    createdRound: combatData.round,
    turnId: game.combat.getCombatantByToken(t.data._id)._id,
    round: 0,
    repeating: { frequency: 1, expire: null, expireAbsolute: false, },
    roundAbsolute: false,
    message: text,
    args: type + t.data.name, 
    userId: game.userId,
    endOfTurn: true,
    recipientIds: []
  }
  TurnAlert.create(alertData);
   let chatData = {
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: text2
            }; ChatMessage.create(chatData, {chatBubble: true});
}

function deleteAlert(type, token){
 if (!game.combat?.data?.flags?.turnAlert?.alerts) {
    ui.notifications.warn("There are no alerts on the currently active combat.");
    return
} else {    
    let alert = TurnAlert.find(c => c.args === `${type}` + `${token}`);
    TurnAlert.delete(alert.combatId, alert.id);
}
}