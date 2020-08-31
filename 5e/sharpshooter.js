/*
Created Monkan#8752 with guidance from the Rage macro in the FVTT Community Macros

Tips to make it work
 1 -    Have a feature called 'Sharpshooter' for your character.
 2 -    Make sure you have your weapons with Ranged Weapon Attack. 
 3 -    if you make any changes to your damage or attack calculations, make sure you toggle it off.
        As it stores the old values to replace once you disable the feat.  It could undo your changes.
*/

let ss='';
let chatMsg='';


if (actor !== undefined && actor !== null) {
    // find the feat Sharpshooter
    ss = actor.items.find(i => i.name === 'Sharpshooter');
    if (ss == undefined) { 
        ui.notifications.warn("Please select a single token with the Sharpshooter feat.");        
    }

    if (ss !== undefined && ss !== null) {
		chatMsg = '';
		let enabled = false;
		// store the state of the Sharpshooter toggle in flags
		if (actor.data.flags.ssMacro !== null && actor.data.flags.ssMacro !== undefined) {
			enabled = true;
		}
		// if Sharpshooter is active, disable it
		if (enabled) {
            chatMsg = `${actor.name} is aiming Normally now.`;
            
            let obj = {};
			obj['flags.ssMacro'] = null;			
			actor.update(obj);

			// reset items
			for (let item of actor.items) {
				if (item.data.flags.ssMacro !== null && item.data.flags.ssMacro !== undefined) {
					// restoring the old value from flags
                    let oldDmg = item.data.flags.ssMacro.oldDmg;
                    let oldAtk = item.data.flags.ssMacro.oldAtk;
					let obj = {};
                    obj['data.damage.parts'] = oldDmg;
                    obj['data.attackBonus'] = oldAtk;
					obj['flags.ssMacro'] = null;
					item.update(obj);
				}
			}
			
		// if Sharpshooter is disabled, enable it
		} else {
            chatMsg = `${actor.name} is aiming very carefully!`;
            
            let obj = {};
			obj['flags.ssMacro.enabled'] = true;
			actor.update(obj);

            // update items
            let ssAtk = -5;
			let ssDmg = 10;
			for (let item of actor.items) {
                let isRanged = getProperty(item, 'data.data.actionType') === 'rwak';                
				if (isRanged && item.data.data.damage.parts.length > 0) {
					console.log('updating ' + item);
                    let obj = {};
                    let atk = item.data.data.attackBonus;
                    let dmg = item.data.data.damage.parts;
                    // Save old attack and damage values
                    obj['flags.ssMacro.oldDmg'] = JSON.parse(JSON.stringify(dmg));
                    obj['flags.ssMacro.oldAtk'] = JSON.parse(JSON.stringify(atk));
                    // Set the new attack and damage values
                    if (atk !== null) {
                        atk += '' + ssAtk;
                    } else {
                        atk = ssAtk;
                    }
					dmg[0][0] = `${dmg[0][0]} + ${ssDmg}`;
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