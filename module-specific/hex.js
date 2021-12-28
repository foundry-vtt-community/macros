//Needs Midi-QoL and timesup modules
//The cursing part of this macro doesn't work when the target is a token with a linked actor sheet (meaning, it should work agains 95% of NPCs, doesn't work for PvP)
//A workaround is asking for your GM to click the spell/feature, since he has the permission to update any actor sheet
//You need to create a new feature for the player to be used to change the Hex curse from one target to the next
//This macro should be called by the OnUse on the Hex spell, the OnUse on this new feature and Bonus Damage Macros on the player
//You need to use the Hex spell to "start" the curse and the new feature to change it to a new target, damage bonus is automatic
// Hex onUse macro
if (args[0].hitTargets.length === 0) return;
if (args[0].tag === "OnUse") {
    let targetUuid = args[0].targets[0].uuid;
	let target = args[0].targets[0];
	let tactor = target?.actor;
    let actor = await MidiQOL.MQfromActorUuid(args[0].actorUuid); // actor who cast the spell
    if (!actor || !targetUuid) {
      console.error("Hex: no token/target selected");
      return;
    }
 
	new Dialog({
		title: 'Choose which ability the target will have disadvantage:',
		content: `
		  <form class="flexcol">
			<div class="form-group">
			  <select id="stat">
				<option value="str">Strength</option>
				<option value="dex">Dexterity</option>
				<option value="con">Constitution</option>
				<option value="int">Intelligence</option>
				<option value="wis">Wisdom</option>
				<option value="cha">Charisma</option>
			  </select>
			</div>
		  </form>
		`,
		buttons: {
			yes: {
				icon: '<i class="fas fa-bolt"></i>',
				label: 'Select',
				callback: async (html) => {
					let stat = html.find('#stat').val();
					// Getting Hex effect from actor
					let effect = actor.effects.find(i => i.data.label === "Hex" && i.data.changes[0].key === "flags.midi-qol.Hexcurse");
					if (effect == null){ //If Hex (from caster) is not active on caster
						if (args[0].item.type !== "spell") {
							ui.notifications.warn("You don't have an active Hex to curse a new target.");
							return{};
						}
						// Define duration based on spell level
						let seconds = (args[0].spellLevel >= 5) ? 86400 :
									   (args[0].spellLevel >= 3) ? 28800 : 3600;
						// Define effect on caster
						const effectData = {
						  changes: [
							{key: "flags.midi-qol.Hexcurse", mode: 5, value: targetUuid, priority: 20}, // who is marked
							// {key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20} // macro to apply the damage
						  ],
						  origin: args[0].itemUuid, //flag the effect as associated to the spell being cast
						  disabled: false,
						  duration: {startTime: game.time.worldTime, seconds: seconds},
						  icon: args[0].item.img,
						  label: args[0].item.name
						}
						await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
						// Define effect on target
						const teffectData = {
						  changes: [{key: `flags.midi-qol.disadvantage.ability.check.${stat}`, mode: 5,value: true, priority: 50}],
						  origin: args[0].itemUuid, //flag the effect as associated to the spell being cast
						  disabled: false,
						  duration: {startTime: game.time.worldTime, seconds: seconds},
						  icon: args[0].item.img,
						  label: args[0].item.name
						}
						await tactor.createEmbeddedDocuments("ActiveEffect", [teffectData]);
						// Update concentration duration
						let effectcon = actor.effects.find(i => i.data.label === "Concentrating");
						let duration = effectcon.data.duration;
						duration.seconds = seconds;
						await effectcon.update({duration});
					} else {
						// Clear effect on last target if 0 HP or stop
						let oldtarget;
						try{
							oldtarget = await fromUuid(effect.data.changes[0].value)
						} catch(err) {
						}
						if (oldtarget != null && oldtarget != undefined){
							if (oldtarget.actor.data.data.attributes.hp.value > 0) {
								ui.notifications.warn("You can only curse a new creature after the current one drops to 0 HP.");
								return{};
							} else {
								let toldeffect = oldtarget.actor.effects.find(i => i.data.label === "Hex" && i.data.origin.includes(actor.id));
								toldeffect.delete();
							}
						}
						// Update link (copied from changelog on midiqol documentation, I didn't really understand what this is doing but it is working (as of testing)
						let cd = getProperty(actor.data, "flags.midi-qol.concentration-data");
						let targets = duplicate(cd.targets || [])
						targets[targets.findIndex(i => i.tokenUuid === effect.data.changes[0].value)] = {tokenUuid: targetUuid, actorUuid: tactor.uuid}
						targets.push({"actorUuid": args[0].actorUuid, "tokenUuid": args[0].tokenUuid});
						actor.setFlag("midi-qol", "concentration-data.targets", targets);
						// Update targetUuid on actor effect
						let changes = effect.data.changes;
						changes[0] = {key: "flags.midi-qol.Hexcurse", mode: 5, value: targetUuid, priority: 20} //who is marked
						await effect.update({changes});
						// Define effect on target
						const teffectData = {
						  changes: [{key: `flags.midi-qol.disadvantage.ability.check.${stat}`, mode: 5,value: true, priority: 50}],
						  origin: effect.data.origin, //flag the effect as associated to the original spell that was cast
						  disabled: false,
						  duration: {startTime: game.time.worldTime, seconds: effect.data.duration.seconds - (game.time.worldTime - effect.data.duration.startTime) },
						  icon: effect.data.icon,
						  label: effect.data.label
						}
						await tactor.createEmbeddedDocuments("ActiveEffect", [teffectData]);
					}
				},
			},
		}
	}).render(true);
} else if (args[0].tag === "DamageBonus") {
    // only attacks
    if (!["mwak","rwak","msak","rsak"].includes(args[0].item.data.actionType)) return {};
    let targetUuid = args[0].hitTargets[0].uuid;
    // only on the marked target
    if (targetUuid !== getProperty(args[0].actor.flags, "midi-qol.Hexcurse")) return {};
    //let damageType = args[0].item.data.damage.parts[0][1];
    const diceMult = args[0].isCritical ? 2: 1;
    return {damageRoll: `${diceMult}d6[Necrotic]`, flavor: "Hex Damage"}
}
