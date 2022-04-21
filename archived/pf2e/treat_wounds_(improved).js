let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Treat Wounds Healing",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
    
}

const handleCrits = (roll) => roll === 1 ? -1 : (roll === 20 ? 1 : 0);

let rollTreatWounds = (args) => {
    let {DC, bonus, skillMod, skillRank, name, magic, mortal, assur} = args;

    const roll = new Roll(`d20`).roll().total;
    const crit = handleCrits(roll)
    const level = token.actor.data.data.details.level.value; 
    let total = 0;

    if (assur) {
      total = 10 + (skillRank*2+level);
    } else {
      total = roll + skillMod;
    }

    let message = `${name} Treats Wounds at a DC ${DC}... they roll a [[${total}]] and`;

    let success = 0;

    if (total >= DC+10 || (total >= DC && mortal)) {
        success = 2;
    } else if (total >= DC) {
        success = 1;
    } else if (total <= DC-10) {
        // Fix for crit fail to match CRB 10 or less
        success = -1;
    }
    if (!assur) {
      success += crit;
    }

  if (magic){
      if (success > 1) {
          toChat(`${message} critically succeed!`, `32+${bonus}`);
      } else if (success === 1) {
          toChat(`${message} succeed.`, `16+${bonus}`);
      } else if (success < 0) {
          toChat(`${message} critically fail! The target takes damage.`, '1d8');
      } else if (success === 0) {
          toChat(`${message} fail.`);
      }
  } else {
      if (success > 1) {
          toChat(`${message} critically succeed!`, `4d8+${bonus}`);
      } else if (success === 1) {
          toChat(`${message} succeed.`, `2d8+${bonus}`);
      } else if (success < 0) {
          toChat(`${message} critically fail! The target takes damage.`, '1d8');
      } else if (success === 0) {
          toChat(`${message} fail.`);
      }
  }

}


let applyChanges = false;
new Dialog({
  title: `Treat Wounds`,
  content: `
    <div>Select a target DC, remember that you can't attempt a heal above your proficiency. Attempting to do so will downgrade the DC and amount healed to the highest you're capable of.<div>
    <hr/>
    <form>
      <div class="form-group">
        <label>Medicine DC:</label>
        <select id="skill-type" name="skill-type">
          <option value="Medicine">Medicine</option>
          <option value="Crafting">Crafting</option>
          <option value="Nature">Nature</option>
        </select>
      </div>
      <div class="form-group">
        <label>Medicine DC:</label>
        <select id="dc-type" name="dc-type">
          <option value="trained">Trained DC 15</option>
          <option value="expert">Expert DC 20, +10 Healing</option>
          <option value="master">Master DC 30, +30 Healing</option>
          <option value="legendary">Legendary DC 40, +50 Healing</option>
        </select>
      </div>
      <div class="form-group">
        <label>DC Modifier:</label>
        <input id="modifier" name="modifier" type="number"/>
      </div>
      <div class="form-group">
        <label>Assurance</label>
        <input id="assur" name="assur" type="checkbox" value="assur"/>
      </div>
      <div class="form-group">
        <label>Medic Dedication</label>
        <input id="medicDed" name="medicDed" type="checkbox" value="medicDed"/>
      </div>
      <div class="form-group">
        <label>Magic Hands</label>
        <input id="magic" name="magic" type="checkbox" value="magic"/>
      </div>
      <div class="form-group">
        <label>Mortal Healing</label>
        <input id="mortal" name="mortal" type="checkbox" value="mortal"/>
      </div>      
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Treat Wounds`,
      callback: () => applyChanges = true
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`
    },
  },
  default: "yes",
  close: html => {
    if (applyChanges) {
      for ( let token of canvas.tokens.controlled ) {
        const {med} = token.actor.data.data.skills;
        const {cra} = token.actor.data.data.skills;
        const {nat} = token.actor.data.data.skills;
        const {name} = token;
        let skillUsed = html.find('[name="skill-type"]')[0].value || "Medicine";
        let prof = html.find('[name="dc-type"]')[0].value || "trained";
        let mod = parseInt(html.find('[name="modifier"]')[0].value) || 0;
        let assur = html.find('[name="assur"]')[0].checked;
        let medicDed = html.find('[name="medicDed"]')[0].checked;
        let magic = html.find('[name="magic"]')[0].checked;
        let mortal = html.find('[name="mortal"]')[0].checked;
        let medic = 0;
        let medRank = med.rank;
        let medMod = med.value;
        var skillRank = 0, skillMod = 0, bogus =7;
          
        switch (skillUsed) {
              case "Medicine":
                skillRank = med.rank;
                skillMod = med.value;
                bogus = 0;
                break;
              case "Crafting":
                skillRank = cra.rank;
                skillMod = cra.value;
                bogus = 1;
                break;
              case "Nature":
                skillRank = nat.rank;
                skillMod = nat.value;
                bogus = 2;
                break;
              default:
                skillRank = 0;
                skillMod = 0;
                bogus = 9;
                break;Z
        }

        if (prof === 'legendary') {
            if (skillRank >= 4) {
                if (medicDed) {
                  medic = 15;
                }
                return rollTreatWounds({DC: 40+mod, bonus: 50+medic, skillMod, skillRank, name, magic, mortal, assur});
            }
            prof = 'master';
        } 
        if (prof === 'master') {
            if (skillRank >= 3) {
                if (medicDed) {
                  medic = 10;
                }
                return rollTreatWounds({DC: 30+mod, bonus: 30+medic, skillMod, skillRank, name, magic, mortal, assur});
            }
            prof = 'expert';
        }
        if (prof === 'expert') {
            if (skillRank >= 2) {
                if (medicDed) {
                  medic = 5;
                }
                return rollTreatWounds({DC: 20+mod, bonus: 10+medic, skillMod, skillRank, name, magic, mortal, assur});
            }
            prof = 'trained';
        }
        if (prof === 'trained') {
            if (skillRank >= 1) {
                return rollTreatWounds({DC: 15+mod, bonus: 0+medic, skillMod, skillRank, name, magic, mortal, assur});
            }
        }
        //toChat(`${name} is not trained in Medicine, and doesn't know how to treat wounds!`);
        toChat(`${name} ${skillUsed} Skill Rank: ${skillRank}, Skill Mod: ${skillMod}`);
        return;
      }
    }
  }
}).render(true);