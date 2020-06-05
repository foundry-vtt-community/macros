//	DISCLAIMER:			This s an evolved version of the original D&D 5e Rage Macro masterwork written by Felix#6196.
//						Norc#5108 is now maintaining this macro along with continued support from Felix.
//
//
//	Updates:			1. 	Fixed errors resulting from declarations of "actor" and "token" in a script macro. 
//						2. 	Added automatic Totem Spirit: Bear detection and resistance application 
//							PLEASE NOTE: A minor update to the Totem Spirit item's name in the character sheet is needed if 
//							the VTTA Beyond Integration was not used to create sheet. See Bonus Tip 1 below
//						3. 	Added error messages for trying to rage with no token or no barbarian selected
//						4. 	(Felix) added resource/usage deduction and errors (re-added after accidentally overwriting the addition) 
//						5. 	(Felix, 2020/05/29) Fixed rage damage at level 8
//						6. 	(2020/05/30) Implemented Felix's idea to use global melee weapon attack bonus instead of modifying items
//						7. 	(2020/05/30) Improved Rage icon toggling to be more reliable
//						8. 	(2020/05/30) Removed code from the resource management that created dependency on The Furnace Advanced Macros
//						9. 	(2020/05/30) Implemented Felix's fix for issue where new resistances and rage uses were not saving properly
//						10.	(2020/05/30) Fixed rage damage formula again...
//						11.	(2020/05/30) Added basic support for non-strength Based barbarians (Dex, Hexblade)
//						12.	(2020/05/30) Added optional ability to toggle the icon and name of the macro itself based on current raging state.
//						13.	(2020/06/04) Fixed bug with experimental macro name/icon toggle only by renaming "actor" and "token"
//						14.	(2020/06/04) Added basic localization support to allow searching for translated class features

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	Bonus Tip 1: Bear Totem Spirit Barbs
//!!!	If you chose the Spirit Seeker Primal path, and at level 3 you chose the Bear Totem Spirit (resistance to all non-psychic damage), 
//!!!	in your 5E character sheet, double-check that the name of your Totem Spirit feature to EXACTLY "Totem Spirit: Bear".  Note: Importing
//!!!	via VTTA Beyond Integration uses this name already. The macro then automatically adds the extra Bear Totem Spirit resistances.
//!!!
//!!!	Bonus Tip 2: Thrown Weapons
//!!!	When a barb throws a weapon using strength, typically a javelin but also possibly a dagger, dart, sword, bar table etc, the rage bonus
//!!!	should not be added because it is a ranged attack. However, D&D5E calls javelins and daggers Melee Weapons, because technically they
//!!!	are both. To solve this issue, if you always throw the weapon, click the weapon's details and change the attack type to "Ranged Weapon
//!!!	Attack" in the Action Type dropdown. If you want, you can add a second copy of the item (with no weight/quantity) to use for meleeing.
//!!!
//!!!	Bonus Tip 3: The Rage Condition                                                                                                                       
//!!!	If you use the Combat Utility Belt module's Condition Lab, try adding a condition called "Raging" with the same icon 			   
//!!!	as the optional rage icon overlay, 'icons/svg/explosion.svg' by default.  See OPTIONAL TOKEN/MACRO ICONS section below.
//!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!   OPTIONAL TOKEN ICON-	On by default. If a path to a rage icon is defined, it displays like a condition on the raging barbarian.
//!!!							To use a different icon, manually change the filepath below or leave it empty ('') to disable the effect.
//!!!
				const rageIconPath = 'icons/svg/explosion.svg';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!   OPTIONAL RESOURCE DEDUCTION 	On by default. First option automatically subtracts from the Rage Resource if enabled.
//!!!									Second option prevents raging if no Rage resource is left. Set to false if you do not want this.

				const deductResource = true;
				const preventNegativeResource = true;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!   OPTIONAL NON-STRENGTH BARBARIAN SUPPORT		ONLY override to FALSE if your barbarian does not use Strength to make melee attacks
//!!!												and therefore does not get the Rage bonus to melee weapon attack damage. 
//!!!		
				const strAttacks = true;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	EXPERIMENTAL MACRO ICON/NAME TOGGLE		If enabled, the macro icon and name toggles based on the barbarian's rage state. 
//!!!											CAUTIONS: 	1. 	This feature is off by default and is intended for ADVANCED USERS ONLY. 
//!!!														2. 	Requires configuration using "The Furnace" module for a player to run!
//!!!															The GM needs to grant The Furnace's "Run as GM" permission for this macro.
//!!!														3. 	Works best with only one barbarian using this feature at a time.

				//To auto-toggle the macro's icon/name, override toggleMacro to true below.
				const toggleMacro = false;

				//To use a different icon, manually change the filepath here
				const stopRageIconPath = 'icons/svg/unconscious.svg';

				//You must update the following constant to this macro's exact for the macro icon toggling to work.
				const rageMacroName = 'Rage';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	BASIC LOCALIZATION SUPPORT				Sets names of D&D5E features as constants instead of hardcoding to allow easier translation.

				const barbClassName = 'Barbarian';
				const rageFeatureName = 'Rage';
				const bearTotemFeatureName = 'Totem Spirit: Bear';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//declarations
let barb = '';
let chatMsg = '';
let bear = '';
let noRage = false;
let toggleResult = false;
let macroActor = actor;
let macroToken = token;

//main
//check to see if Actor exists and is a barbarian
if (macroActor !== undefined && macroActor !== null) {
				
	// get the barbarian class item
	barb = macroActor.items.find(i => i.name === `${barbClassName}`);
	if (barb == undefined) {
		ui.notifications.warn("Please select a single barbarian token.");
	}
	if (barb !== undefined && barb !== null) {
		chatMsg = '';
		let enabled = false;
		// store the state of the rage toggle in flags
		if (macroActor.data.flags.rageMacro !== null && macroActor.data.flags.rageMacro !== undefined) {
			enabled = true;
		}
		
		// if rage is active, disable it
		if (enabled) {
			chatMsg = `${macroActor.name} is no longer raging.`;
			// reset resistances and melee weapon attack bonus
			let obj = {};
			obj['flags.rageMacro'] = null;
			obj['data.traits.dr'] = macroActor.data.flags.rageMacro.oldResistances;		
			obj['data.bonuses.mwak.damage'] = macroActor.data.flags.rageMacro.oldDmg;	
			macroActor.update(obj);
			
		// if rage is disabled, enable it
		} else {
			if (deductResource) {
				let hasAvailableResource = false;
				let newResources = duplicate(macroActor.data.data.resources)				
				let obj = {}
				// Look for Resources under the Core macroActor data
				let resourceKey = Object.keys(macroActor.data.data.resources).filter(k => macroActor.data.data.resources[k].label === `${rageFeatureName}`).shift();
				if (resourceKey && (macroActor.data.data.resources[resourceKey].value > 0 || !preventNegativeResource)) {
					hasAvailableResource = true;
					newResources[resourceKey].value--;					
					obj['data.resources'] = newResources 
					macroActor.update(obj);
				}
				if (!hasAvailableResource) {
					ui.notifications.error(`${macroActor.name} does not have any rage left, time for a long rest!`);
					noRage=true;
				}
				if (macroActor.sheet.rendered) {
					// Update the macroActor sheet if it is currently open
					macroActor.render(true);
				}
			}
			
			//activate rage if there is rage available, or if it is okay to rage with 0 resources
			if (!noRage) {
				chatMsg = `${macroActor.name} is RAAAAAGING!`;
				// update resistance
				let obj = {};
				// storing old resistances in flags to restore later
				obj['flags.rageMacro.enabled'] = true;
				obj['flags.rageMacro.oldResistances'] = JSON.parse(JSON.stringify(macroActor.data.data.traits.dr));
				// add bludgeoning, piercing and slashing resistance
				let newResistance = duplicate(macroActor.data.data.traits.dr);
				if (newResistance.value.indexOf('bludgeoning') === -1) newResistance.value.push('bludgeoning');
				if (newResistance.value.indexOf('piercing') === -1) newResistance.value.push('piercing');
				if (newResistance.value.indexOf('slashing') === -1) newResistance.value.push('slashing');
				//If bear totem, add bear totem resistances.
				bear = macroActor.items.find(i => i.name === `${bearTotemFeatureName}`)
				if (bear !== undefined && bear!== null) {
					if (newResistance.value.indexOf('acid') === -1) newResistance.value.push('acid');
					if (newResistance.value.indexOf('cold') === -1) newResistance.value.push('cold');
					if (newResistance.value.indexOf('fire') === -1) newResistance.value.push('fire');
					if (newResistance.value.indexOf('force') === -1) newResistance.value.push('force');
					if (newResistance.value.indexOf('lightning') === -1) newResistance.value.push('lightning');
					if (newResistance.value.indexOf('necrotic') === -1) newResistance.value.push('necrotic');
					if (newResistance.value.indexOf('poison') === -1) newResistance.value.push('poison');
					if (newResistance.value.indexOf('radiant') === -1) newResistance.value.push('radiant');
					if (newResistance.value.indexOf('thunder') === -1) newResistance.value.push('thunder');
				}
				obj['data.traits.dr'] = newResistance;
				macroActor.update(obj);
			
				// For Strength barbarians, update global melee weapon attack bonus to include rage bonus
				if (strAttacks) {
					// Preserve old mwak damage bonus if there was one
					let dmg = macroActor.data.data.bonuses.mwak.damage;
					if (dmg==null || dmg == undefined || dmg == '') dmg = 0;
					obj['flags.rageMacro.oldDmg'] = JSON.parse(JSON.stringify(dmg));
			
					// Determining the barbarian level
					let barblvl = barb.data.data.levels;
			
					// Formula to determine the rage bonus damage depending on barbarian level
					let lvlCorrection =  barblvl === 16 || barblvl === 17 ? 1 : 0;
					let rageDmg = 2 + Math.floor(barblvl / 9) + lvlCorrection;
				
					//actually add the bonus rage damage to the previous bonus damage
					//respect roll formulas if present.
					if (parseInt(dmg) == dmg) {
						obj['data.bonuses.mwak.damage'] = parseInt(dmg) + rageDmg;
					} else {
					obj['data.bonuses.mwak.damage'] = `${dmg} + ${rageDmg}`;
					}
					
					macroActor.update(obj);
				}
			}
		}

		if (!noRage) {
			// toggle rage icon, if rage path is defined above
			(async () => { 
				toggleResult = await macroToken.toggleEffect(rageIconPath);
				if (toggleResult == enabled) macroToken.toggleEffect(rageIconPath);  
			})();
			
			//toggle macro icon and name, if macro name is correct and stop rage icon path is defined
			let rageMacro = game.macros.getName(rageMacroName);
				//check for name of macro in its "off" form
				if (rageMacro == null || rageMacro == undefined) {
					rageMacro = game.macros.getName('Stop ' + rageMacroName);
				}
			let obj = {};
			if ( (rageMacro !== null && rageMacro !== undefined) && toggleMacro == true && 
					+ (stopRageIconPath !== null && stopRageIconPath !== undefined && stopRageIconPath !== '') ) {
				if (enabled) {
				  obj['img'] = rageIconPath;
				  obj['name'] = rageMacroName;
				} else {
				  obj['img'] = stopRageIconPath;
				  obj['name'] = 'Stop ' + rageMacroName;
				}
				rageMacro.update(obj);
			} else {
			if (toggleMacro == true) ui.notifications.warn("Rage macro named " + `${rageMacroName}` + " not found. Rage toggle successful but unable to toggle macro icon.");
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