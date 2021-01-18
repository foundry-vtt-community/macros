//		DISCLAIMER:		This macro is heavily based on the original D&D 5e Rage Macro masterwork written by Felix#6196.
//						Norc#5108 created and is maintaining this macro.
//
//						Updates:	1.	2020/06/05: Initial version.

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	Bonus Tip: Sneak Attack as a Condition                                                                                                                       
//!!!	If you use the Combat Utility Belt module's Condition Lab, try adding a condition called "Sneaky" with the same icon 			   
//!!!	as the optional sneak attack icon overlay, 'icons/svg/mystery-man-black.svg' by default.  See EXPERIMENTAL MACRO ICON/NAME TOGGLE below.
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!   OPTIONAL TOKEN ICON-	On by default. If a path to a sneak attack icon is defined, it displays like a condition on the sneaking rogue.
//!!!							To use a different icon, manually change the filepath below or leave it empty ('') to disable the effect.
//!!!
const sneakIconPath = 'icons/svg/mystery-man-black.svg';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	EXPERIMENTAL MACRO ICON/NAME TOGGLE		If enabled, the macro icon and name toggles based on whether the rogue is currently sneaking. 
//!!!											CAUTIONS: 	1. 	This feature is off by default and is intended for ADVANCED USERS ONLY. 
//!!!														2. 	Requires configuration using "The Furnace" module for a player to run!
//!!!															The GM needs to grant The Furnace's "Run as GM" permission for this macro.
//!!!														3. 	Works best with only one rogue using this feature at a time.

				//To auto-toggle the macro's icon/name, override toggleMacro to true below.
				const toggleMacro = false;

				//To use a different icon, manually change the filepath here
				const stopSneakIconPath = 'icons/svg/cowled.svg';

				//You must update the following constant to this macro's exact name for the macro icon toggling to work.
				const sneakMacroName = 'Sneak Attack';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let toggleResult = false;
let enabled = false;
let errorReason = '';
let sneakAttack = {};
let rogue = {};
let rogueLvls = 0;
let sneakDice = 0;
let chatMsg = '';
let oldMDmg = '';
let oldRDmg = '';

let macroActor = actor;
let macroToken = token;

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!	BASIC LOCALIZATION SUPPORT				Sets names of D&D5E features as constants instead of hardcoding to allow easier translation.
//!!!											Sets error messages as constants also for easier translation.

				const rogueClassName = 'Rogue';
				const sneakAttackFeatureName = 'Sneak Attack';

				const errorSelectRogue = 'Please select a single rogue token.';
				const warnMacroNotFound = ' is not a valid macro name, please fix. Sneak attack toggle successful but unable to alter macro.';
				const errorSelectToken = 'Please select a token.';
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


//check to ensure token is selected and attempt to define the sneak attack feature
if (macroActor !== null && macroActor !== undefined) {
	sneakAttack = macroActor.items.find(i => i.name == `${sneakAttackFeatureName}`);
} else {
errorReason = `${errorSelectToken}`;
}

//check to ensure token is a rogue
if (errorReason == '' && macroActor.items.find(i => i.name == `${rogueClassName}`) !== null) {
	rogue = macroActor.items.find(i => i.name == `${rogueClassName}`);
} else {
	errorReason = `${errorSelectRogue}`;
}

console.log(`Error reason is: ${errorReason}`);
//main execution now that errors are caught

if (errorReason == '') {
	
	chatMsg = '';
	let enabled = false;
	// store the state of the sneak attack toggle in flags
	if (macroActor.data.flags.sneakMacro !== null && macroActor.data.flags.sneakMacro !== undefined) {
		enabled = true;
	}
	
	// if sneak attack is active, disable it
	if (enabled) {
		chatMsg = `${macroActor.name} is no longer sneak attacking.`;
		// ranged and melee weapon attack bonus
		let obj = {};
		obj['flags.sneakMacro'] = null;		
		obj['data.bonuses.mwak.damage'] = macroActor.data.flags.sneakMacro.oldMDmg;			
		obj['data.bonuses.rwak.damage'] = macroActor.data.flags.sneakMacro.oldRDmg;	
		macroActor.update(obj);
		
	// if sneak attack is disabled, enable it
	} else {		
		chatMsg = `${macroActor.name} starts sneak attacking!`;
		
		let obj = {};
		obj['flags.sneakMacro.enabled'] = true;

		// Preserve old mwak damage bonus if there was one
		let oldMDmg = macroActor.data.data.bonuses.mwak.damage;
		if (oldMDmg==null || oldMDmg == undefined || oldMDmg == '') oldMDmg = 0;
		obj['flags.sneakMacro.oldMDmg'] = JSON.parse(JSON.stringify(oldMDmg));

		// Preserve old rwak damage bonus if there was one
		let oldRDmg = macroActor.data.data.bonuses.rwak.damage;
		if (oldRDmg==null || oldRDmg == undefined || oldRDmg == '') oldRDmg = 0;
		obj['flags.sneakMacro.oldRDmg'] = JSON.parse(JSON.stringify(oldRDmg));

		
		// Determining the rogue level
		rogueLvls = rogue.data.data.levels;

		// Formula to determine the sneak attack damage depending on rogue level	
		sneakDice = Math.ceil(rogueLvls/2);
	
		//actually add the bonus sneak attack damage to the previous bonus damage
		//respect roll formulas if present.
		if (oldMDmg==null || oldMDmg == undefined || oldMDmg == '' || oldMDmg == 0) {
			obj['data.bonuses.mwak.damage'] = `${sneakDice}d6`;
		} else {
			obj['data.bonuses.mwak.damage'] = `${oldMDmg} + ${sneakDice}d6`;
		}

		if (oldRDmg==null || oldRDmg == undefined || oldRDmg == '' || oldRDmg == 0) {
			obj['data.bonuses.rwak.damage'] = `${sneakDice}d6`;
		} else {
			obj['data.bonuses.rwak.damage'] = `${oldRDmg} + ${sneakDice}d6`;
		}	

		macroActor.update(obj);

	}	
	
	//mark or unmark character's token with Sneaky effect icon, if sneakIconPath is defined
	(async () => { 
		toggleResult = await macroToken.toggleEffect(sneakIconPath);
		if (toggleResult == enabled) macroToken.toggleEffect(sneakIconPath);  
	})();

	//toggle macro icon and name, if enabled
	if (toggleMacro) {
//		Norc's preferred icons, not sure if publicly available
//		sneakyMacroImgPath = 'systems/dnd5e/icons/skills/shadow_17.jpg';
//		stopSneakIconPath = 'systems/dnd5e/icons/skills/yellow_11.jpg';
		let sneakMacro = game.macros.getName(sneakMacroName);
			//Also check for name of macro in its "off" form
			if (sneakMacro == null || sneakMacro == undefined) {
				sneakMacro = game.macros.getName('Stop ' + sneakMacroName);
			}
		let obj = {};
		if ( (sneakMacro !== null && sneakMacro !== undefined) && 
				+ (stopSneakIconPath !== null && stopSneakIconPath !== undefined && stopSneakIconPath !== '') ) {
			if (enabled) {
			obj['img'] = sneakIconPath;
			obj['name'] = sneakMacroName;
			} else {
			obj['img'] = stopSneakIconPath;
			obj['name'] = 'Stop ' + sneakMacroName;
			}
			sneakMacro.update(obj);
		} else {
		ui.notifications.warn(`${sneakMacroName} ${warnMacroNotFound}`);			
		}
	}

} else {
ui.notifications.error(`${errorReason}`);	
}
if (chatMsg !== '') {
	let chatData = {
		user: game.user._id,
		speaker: ChatMessage.getSpeaker(),
		content: chatMsg
	};
	ChatMessage.create(chatData, {});
}
