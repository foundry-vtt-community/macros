/*
Created Monkan#8752 with guidance from the Rage macro in the FVTT Community Macros

Tips to make it work
 1 -    Have a feature called 'Great Weapon Master' for your character.
 2 -    Make sure you have your weapons with Heavy property filled out. 
 3 -    if you make any changes to your damage or attack calculations, make sure you toggle it off.
        As it stores the old values to replace once you disable the feat.  It could undo your changes.
*/

let gwm='';
let chatMsg='';


if (actor !== undefined && actor !== null) {
    // find the feat Great Weapon Master
    gwm = actor.items.find(i => i.name === 'Great Weapon Master');
    if (gwm == undefined) { 
        ui.notifications.warn("Please select a single token with the Great Weapon Master feat.");        
    }

    if (gwm !== undefined && gwm !== null) {
		chatMsg = '';
		let enabled = false;
		// store the state of the GWM toggle in flags
		if (actor.data.flags.gwmMacro !== null && actor.data.flags.gwmMacro !== undefined) {
			enabled = true;
		}
		// if GWM is active, disable it
		if (enabled) {
            chatMsg = `${actor.name} is swinging Normally now.`;
            
            let obj = {};
			obj['flags.gwmMacro'] = null;			
			actor.update(obj);

			// reset items
			for (let item of actor.items) {
				if (item.data.flags.gwmMacro !== null && item.data.flags.gwmMacro !== undefined) {
					// restoring the old value from flags
                    let oldDmg = item.data.flags.gwmMacro.oldDmg;
                    let oldAtk = item.data.flags.gwmMacro.oldAtk;
					let obj = {};
                    obj['data.damage.parts'] = oldDmg;
                    obj['data.attackBonus'] = oldAtk;
					obj['flags.gwmMacro'] = null;
					item.update(obj);
				}
			}
			
		// if GWM is disabled, enable it
		} else {
            chatMsg = `${actor.name} is swinging Harder!`;
            
            let obj = {};
			obj['flags.gwmMacro.enabled'] = true;
			actor.update(obj);

            // update items
            let gwmAtk = -5;
			let gwmDmg = 10;
			for (let item of actor.items) {
                let isMelee = getProperty(item, 'data.data.actionType') === 'mwak';
                let isHeavy = getProperty(item, 'data.data.properties.hvy')
				if (isMelee && isHeavy && item.data.data.damage.parts.length > 0) {
					console.log('updating ' + item);
                    let obj = {};
                    let atk = item.data.data.attackBonus;
                    let dmg = item.data.data.damage.parts;
                    // Save old attack and damage values
                    obj['flags.gwmMacro.oldDmg'] = JSON.parse(JSON.stringify(dmg));
                    obj['flags.gwmMacro.oldAtk'] = JSON.parse(JSON.stringify(atk));
                    // Set the new attack and damage values
                    if (atk !== null) {
                        atk += '' + gwmAtk;
                    } else {
                        atk = gwmAtk;
                    }
					dmg[0][0] = `${dmg[0][0]} + ${gwmDmg}`;
                    obj['data.damage.parts'] = dmg;
                    obj['data.attackBonus'] = atk;
					item.update(obj);
				}
			}

		}
    }

} else ui.notifications.warn("Please select a token.");

// write to chat if needed:
if (chatMsg !== '') {
	let chatData = {
		user: game.user._id,
		speaker: ChatMessage.getSpeaker(),
		content: chatMsg
    };
	ChatMessage.create(chatData, {});
}