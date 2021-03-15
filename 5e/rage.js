//		DISCLAIMER:		This macro is an evolved version of the original D&D 5e Rage Macro masterwork written by Felix#6196.
//						Norc#5108 is now maintaining this macro along with continued support from Felix.
//
//
//		UPDATES:		1.	Fixed errors resulting from declarations of "actor" and "token" in a script macro. 
//							Added automatic Totem Spirit: Bear detection and resistance application 
//							Added error messages for trying to rage with no token or no barbarian selected
//						2.	(Felix) Added resource/usage deduction and errors (re-added after accidentally overwriting the addition)
//							Fixed rage damage at level 8
//						3.	(2020/05/30) "Version 2.0" 	
//							Implemented Felix's idea to use global melee weapon attack bonus instead of modifying items
//							Improved Rage icon toggling to be more reliable
//							Removed code from the resource management that created dependency on The Furnace Advanced Macros
//							Implemented Felix's fix for issue where new resistances and rage uses were not saving properly
//							Fixed rage damage formula again...
//							Added basic support for non-strength Based barbarians (Dex, Hexblade)
//							Added optional ability to toggle the icon and name of the macro itself based on current raging state.
//						4.	(2020/06/04) 
//							Fixed bug with experimental macro name/icon toggle only by renaming "actor" and "token"
//							Added basic localization support to allow searching for translated class features
//						5.	(2020/06/10)
//							Rework to rage damage logic under the hood for edge case (other changes to bonus damage mid-combat) 
//							Removed logic that was causing multiple character sheets to open in some cases
//							Enhanced localization support

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!   Bonus Tip 1: 		Optional Rage Resource Consumption
//!!!	To automatically use and track Rage, you must have a resource exactly named "Rage" on your character sheet. This text can be changed
//!!!	by altering the value for "rageResourceName" in the LOCALIZATION SUPPORT section below).
//!!!	Note: 	Importing via VTTA Beyond Integration uses this text already. The macro can then automatically detect the Rage resource.
//!!!
//!!!	Bonus Tip 2: 		Bear Totem Spirit Barbs
//!!!	If you chose the Spirit Seeker Primal path, and at level 3 you chose the Bear Totem Spirit (resistance to all non-psychic damage), 
//!!!	in your 5E character sheet, double-check that the name of your Totem Spirit feature to EXACTLY "Totem Spirit: Bear". This text can be
//!!!	changed by altering the value for "bearTotemFeatureName" in the LOCALIZATION SUPPORT section below).
//!!!	Note: 	Importing via VTTA Beyond Integration uses this text already. The macro then automatically adds the extra 
//!!!			Bear Totem Spirit resistances.
//!!!
//!!!	Bonus Tip 3: 		Thrown Weapons
//!!!	When a barb throws a weapon using strength, typically a javelin but also possibly a dagger, dart, sword, bar table etc, the rage bonus
//!!!	should not be added because it is a ranged attack. However, D&D5E calls javelins and daggers Melee Weapons, because technically they
//!!!	are both. To solve this issue, if you always throw the weapon, click the weapon's details and change the attack type to "Ranged Weapon
//!!!	Attack" in the Action Type dropdown. If you want, you can add a second copy of the item (with no weight/quantity) to use for meleeing.
//!!!
//!!!	Bonus Tip 4: 		The Rage Condition
//!!!	If you use the Combat Utility Belt module's Condition Lab, try adding a condition called "Raging" with the same icon
//!!!	as the optional rage icon overlay, 'icons/svg/explosion.svg' by default.  See EXPERIMENTAL MACRO ICON/NAME TOGGLE section below.
//!!!
//!!!	Bonus Tip 5: 		Obsidian Sheet Compatibility
//!!!	If using Obsidian module, try replacing "Barbarian" with "brb" as the barbClassName value in LOCALIZATION SUPPORT below.
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	OPTIONAL TOKEN ICON-	On by default. If a path to a rage icon is defined, it displays like a condition on the raging barbarian.
//!!!							To use a different icon, manually change the filepath below or leave it empty ('') to disable the effect.
//!!!
const rageIconPath = 'icons/svg/explosion.svg';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	OPTIONAL RESOURCE DEDUCTION 	On by default. First option automatically subtracts from the Rage Resource if enabled.
//!!!									Second option prevents raging if no Rage resource is left. Set to false if you do not want this.

			const deductResource = true;
			const preventNegativeResource = true;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	OPTIONAL NON-STRENGTH BARBARIAN SUPPORT		ONLY override to FALSE if your barbarian does not use Strength to make melee attacks
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

			//You must update the following constant to this macro's exact name for the macro icon toggling to work.
			const rageMacroName = 'Rage';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//declarations
let barb = '';
let chatMsg = '';
let bear = '';
let noRage = false;
let rageDmgAdded = false;
let toggleResult = false;
let macroActor = actor;
let macroToken = token;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	LOCALIZATION SUPPORT				Sets names of D&D5E features as constants instead of hardcoding to allow easier translation.
//!!!										Sets error messages and flavor text as constants also for easier translation.
//!!!
			//MUST MATCH VALUES IN CHARACTER SHEET (if present)
			const barbClassName = 'Barbarian';
			const rageResourceName = 'Rage';
			const bearTotemFeatureName = 'Totem Spirit: Bear';

			//All remaining values may be changed freely

			//Rage chat message flavor text. Actor's name appears immediately before these two strings in the message.
			const rageMsg = ' is RAAAAAGING!'
			const endRageMsg =  ' is no longer raging.';

			//error and warning messages
			const errorSelectBarbarian = 'Please select a single barbarian token.';
			const errorNoRage = ' does not have any rage left, time for a long rest!';
			const warnMacroNotFound = ' is not a valid macro name, please fix. Rage toggle successful but unable to alter macro.';
			const errorSelectToken = 'Please select a token.';
			const errorFailRevert = 'Failed to revert global melee weapon attack bonus, please check manually.';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//main
//check to see if Actor exists and is a barbarian
if (macroActor !== undefined && macroActor !== null) {

	// get the barbarian class item
	barb = macroActor.items.find(i => i.name === `${barbClassName}`);
	if (barb == undefined) {
		ui.notifications.warn(`${errorSelectBarbarian}`);
	}
	if (barb !== undefined && barb !== null) {
		let enabled = false;
		// Store the state of the rage toggle flags that indicate if rage is active or not
		if (macroActor.data.flags.rageMacro !== null && macroActor.data.flags.rageMacro !== undefined) {
			enabled = true;
				// Store whether there is also a rage damage bonus currently active
				if (macroActor.data.flags.rageMacro["rageDmgAdded"] == true) {
					rageDmgAdded = true;
				}
		}

		//Calculate rage value for use in damage reversion and application
		// Determining the barbarian level
		let barblvl = barb.data.data.levels;

		// Formula to determine the rage bonus damage depending on barbarian level
		let lvlCorrection =  barblvl === 16 || barblvl === 17 ? 1 : 0;
		let rageDmg = 2 + Math.floor(barblvl / 9) + lvlCorrection;
		let dmg = JSON.parse(JSON.stringify(macroActor.data.data.bonuses.mwak.damage));

		// if rage is active, disable it
		if (enabled) {
			chatMsg = `${macroActor.name} ${endRageMsg}`;
			// reset resistances and melee weapon attack bonus
			let obj = {};
			obj['flags.rageMacro'] = null;
			//revert damage resistances
			obj['data.traits.dr'] = macroActor.data.flags.rageMacro.oldResistances;

			//carefully revert rage global mwak damage bonus to original value, if that bonus is active
			//eventually want to add support so only last instance found is replaced.
			if(rageDmgAdded) {
				if (dmg == rageDmg || dmg == null || dmg == undefined || dmg == '' || dmg == 0){
					console.log('Removing simple rage damage');
					obj['data.bonuses.mwak.damage']='';
				} else {
					console.log('Removing complex rage damage');
					let patt = `\\s\\+\\s${rageDmg}($|[^0123456789dkrxcm(@{])`;
					let result = dmg.search(patt);
					if (result !== -1) {
						let len = ('' + rageDmg).length;
						let origDmg = duplicate(dmg);
						let firstHalfDmg = duplicate(dmg).substring(0,result);
						//Test String: 2d6 + 2 + 2d6
						let lastHalfDmg = duplicate(dmg).substring(result+3+len, origDmg.length);
						dmg = `${firstHalfDmg}${lastHalfDmg}`;
						obj['data.bonuses.mwak.damage']=dmg;
					} else {
						ui.notifications.error(`${errorFailRevert}`);
					}
				}
			}
			macroActor.update(obj);

		// if rage is disabled, enable it
		} else {
			if (deductResource) {
				let hasAvailableResource = false;
				let newResources = duplicate(macroActor.data.data.resources)
				let obj = {}
				// Look for Resources under the Core macroActor data
				let resourceKey = Object.keys(macroActor.data.data.resources).filter(k => macroActor.data.data.resources[k].label === `${rageResourceName}`).shift();
				if (resourceKey && (macroActor.data.data.resources[resourceKey].value > 0 || !preventNegativeResource)) {
					hasAvailableResource = true;
					newResources[resourceKey].value--;
					obj['data.resources'] = newResources 
					macroActor.update(obj);
				}
				if (!hasAvailableResource) {
					ui.notifications.error(`${macroActor.name} ${errorNoRage}`);
					noRage=true;
				}
			}

			//activate rage if there is rage available, or if it is okay to rage with 0 resources
			if (!noRage) {
				chatMsg = `${macroActor.name} ${rageMsg}`;
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
					obj['flags.rageMacro.rageDmgAdded'] = true;
					// Preserve old mwak damage bonus if there was one, just in case
					obj['flags.rageMacro.oldDmg'] = JSON.parse(JSON.stringify(dmg));
					//actually add the bonus rage damage to the previous bonus damage
					//respect roll formulas by doing string addition if value is already present.
					if (dmg == null || dmg == undefined || dmg == 0 || dmg == '') {
						console.log('Adding simple rage damage');
						obj['data.bonuses.mwak.damage'] = rageDmg;
					} else {
						console.log('Adding complex rage damage');
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
			if (toggleMacro == true) ui.notifications.warn(`${rageMacroName} ${warnMacroNotFound}`);
			}
		}
	}
} else ui.notifications.warn(errorSelectToken);
// write to chat if needed:
if (chatMsg !== '') {
	let chatData = {
		user: game.user._id,
		speaker: ChatMessage.getSpeaker(),
		content: chatMsg
	};
	ChatMessage.create(chatData, {});
}
