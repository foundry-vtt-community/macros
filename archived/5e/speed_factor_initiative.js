/*
* this macro rolls initiative by using the rules for the optional rule "Speed factor initiative", available in the Dungeon Master's Guide at page 270
* select the tokens for which you want to roll initiative and click the macro. 
* Alternatively, if you have an actor assigned and no token selected, the macro will roll initiative for your assigned actor
* the macro does not roll initiative for actors not in combat
* requires DnD5e Game System
* created by Gabro#4634, with the invaluable help of Freeze#2689
*/


//List of actions with their relative bonuses
var actions = {
	"Medium Action                  (+0)" : +0,
	"Melee, Heavy Weapon            (-2)" : -2,
	"Melee, Light or Finesse Weapon  (+2)" : +2,
	"Melee, Two-Handed Weapon       (-2)" : -2,
	"Ranged, Loading Weapon         (-5)" : -5,
	"Spellcasting, 1st level        (-1)" : -1,
	"Spellcasting, 2nd level        (-2)" : -2,
	"Spellcasting, 3rd level        (-3)" : -3,
	"Spellcasting, 4th level        (-4)" : -4,
	"Spellcasting, 5th level        (-5)" : -5,
	"Spellcasting, 6th level        (-6)" : -6,
	"Spellcasting, 7th level        (-7)" : -7,
	"Spellcasting, 8th level        (-8)" : -8,
	"Spellcasting, 9th level        (-9)" : -9
//optional rules as suggested by AngryDM (https://theangrygm.com/fine-i-wrote-about-speed-factor-initiative-in-dd-5e/), remove them if you don't want them
   ,"Very Slow Action               (-5)" : -5,
	"Slow Action                    (-2)" : -2,
	"Fast Action                    (+2)" : +2,
	"Very Fast Action               (+5)" : +5
}

// this option, as it is, disables the possibility to modify the box relative to the size and dex initiative bonus. If you want to modify them, change it to:
// var disableTexts = ''
var disableTexts = 'disabled="disabled"'


// list of sizes present in 5e, optionally it's possible to modify the bonuses (but not the size names "tiny", "sm", etc)
var sizes = {
  "tiny" : +5,
  "sm" : +2,
  "med" : +0,
  "lg" : -2,
  "huge" : -5,
  "grg" : -8
};

var options = new Array ()
for (var key in actions) {
options.push(key)
}

if (canvas.tokens.controlled.length >= 1) {
	(async ()=>{
		for (let token of canvas.tokens.controlled) {
			let combatant = game.combats.active.combatants.find(c => c.tokenId === token.id)
			if (combatant == null){
				console.log(token.name + " is not in combat")
			} else {
				let data = [
				{type : `text`, label : `Base modifier : `, options : `${token.actor.data.data.attributes.init.total}` },
				{type : `text`, label : `Size modifier : `, options : `${sizes[token.actor.data.data.traits.size]}` },
				{type : `select`, label : `Action : `, options}
			];
                let rv = await quick_dialog({data}, combatant.name);
				rollInit(token, rv)
			}
		}
	})();
} else {
	(async ()=>{
		if (game.user.character == null){
			console.log("player has no player selected in player configuration menu")
		} else {
			for (let token of game.user.character.getActiveTokens()) {
				let combatant = game.combats.active.combatants.find(c => c.tokenId === token.id)
				if (combatant == null){
					console.log(token.name + " is not in combat")
				} else {
					let data = [
					{type : `text`, label : `Base modifier : `, options : `${token.actor.data.data.attributes.init.total}` },
					{type : `text`, label : `Size modifier : `, options : `${sizes[token.actor.data.data.traits.size]}` },
					{type : `select`, label : `Action : `, options}
					];
					let rv = await quick_dialog({data}, combatant.name);
					rollInit(token, rv)
				}
			}
		}
	})();
}



async function quick_dialog({data, title = `Select your action for `} = {}, name)
{
  data = data instanceof Array ? data : [data];

  let value = await new Promise((resolve) => {
    let content = `
    <table style="width:100%">
      ${data.map(({type, label, options}, i)=> {
        if(type.toLowerCase() === `select`)
        {
          return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><select id="${i}qd">${options.map((e,i)=> `<option value="${e}">${e}</option>`).join(``)}</td></tr>`;
        }else{
          return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><input type="${type}" ${disableTexts} id="${i}qd" value="${options instanceof Array ? options[0] : options}"/></td></tr>`;
        }
      }).join(``)}
    </table>`;

    new Dialog({
      title : title + name,
	  content,
      buttons : {
        Ok : { label : `Roll Initiative!`, callback : (html) => {
          resolve(Array(data.length).fill().map((e,i)=>{
            let {type} = data[i];
            if(type.toLowerCase() === `select`)
            {
              return html.find(`select#${i}qd`).val();
            }else{
                return html.find(`input#${i}qd`)[0].value;
            }
          }));
        }}
      }
    }).render(true);
  });
  return value;
}

function rollInit(selectedToken, initBonus){
	let combatant = game.combats.active.combatants.find(c => c.tokenId === selectedToken.id)
	var formula = ''
	if (selectedToken.actor.data.flags != null && selectedToken.actor.data.flags.dnd5e != null && selectedToken.actor.data.flags.dnd5e.initiativeAdv){
		formula = '2d20kh + @dexBonus + @sizemod + @init'
	} else {
		formula = '1d20 + @dexBonus + @sizemod + @init'
	}
	let r= new Roll(formula, {dexBonus : initBonus[0], sizemod: initBonus[1], init: actions[initBonus[2]]}).roll()

r.toMessage({flavor : `${combatant.name} chooses ${initBonus[2]} and rolls for Initiative!`});
game.combats.active.updateCombatant({_id: combatant._id, initiative: r.total})
}
