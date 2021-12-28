// Macro made on Foundry 0.8.9, Dnd5e System 1.5.6
// This macro needs modules Midi-QOL 0.8.96, DAE 0.8.75 and Dnd5e-helpers 3.0.4
// Create a macro called <Pearl of Power> (without <>)
// Pearl of Power has to call this macro on midiqol option "On Use Macros", after Active Effects
if (args[0] == "on"){
	return{};
} else if (args[0] == "off"){
	// Execute when effect is lost
	let actor = await MidiQOL.MQfromActorUuid(args[2].actorUuid); // actor who lost the effect
	// Deleting the extra spell slot of 3rd level
	let actor_data = duplicate(actor.data._source);
	actor_data.data.spells.spell3.override = null;
	actor_data.data.spells.spell3.value = 0;
	actor.update(actor_data);
	// Deleting the Hook on update actor
	Hooks.off(`updateActor`, args[1]);
} else {
	// Execute when using the Pearl of Power
	let ator = args[0].actor;
	let act = game.actors.get(args[0].actor._id);
	let item = args[0].item;
	let spellx;
	// Check pact magic and spell levels that have used slots
	for (let i = 0; i < 10; i++)
	{
		let spells = (i==0) ? ator.data.spells["pact"] : ator.data.spells["spell" + i];
		if (spells.max > 0 && spells.value < spells.max)
		{
			if (i == 0)
			{
				spellx = `<option value="0">Pact slot</option>`;
			} else if (i == 1)
			{
				spellx = `<option value="1">1st Level</option>`;
			} else if (i == 2)
			{
				spellx = spellx + `<option value="2">2nd Level</option>`;
			} else if (i == 3)
			{
				spellx = spellx + `<option value="3">3rd Level</option>`;
			} else 
			{
				spellx = spellx + `<option value="` + i + `">` + i + `th Level</option>`;
			}
		};
		if (!spellx){
			ui.notifications.warn("You don't have spent spell slots.");
			return{};
		}
	};
	let d = new Dialog({
		title: 'Pearl of Power: Usage Configuration',
		content: `
	  <form style="font-size:13px" class="dnd5e" id="ability-use-form">
		<p>Which spell slot to recover with Pearl of Power.</p>
		<p class="notes"></p>
		<div class="form-group">
		  <label>Spell Slot Level</label>
			<select id="spellSlots" name="level">`+ spellx + `
			</select>
		</div>
	</form>
	  `,
		buttons: {
			yes: {
				icon: '<i class="fas fa-dice-d20"></i>',
				label: 'Use Feature',
				callback: async (html) =>
				{
					let level = html.find('[name="level"]').val();
					let actor_data = duplicate(act.data._source);
					let sourcespells = actor_data.data.spells;
					let spells = ator.data.spells;
					//Pact spell slot
					if (level == 0)
					{
						// Pact spell slot of 4th level or greater
						if (spells.pact.level > 3)
						{
							// If actor already has 3rd level spells (not pact), just add one slot
							if (spells.spell3.max > 0){
								sourcespells.spell3.value += 1;
							} else {
								sourcespells.spell3.value += 1;
								sourcespells.spell3.override = 1;
							}
						} else
						{
							// Pact spell of 3rd level of lesser, just add one slot
							sourcespells.pact.value += 1;
						}
					// If regular spell slot
					} else if (level < 3)
					{
						// Of 1st or 2nd level, just add a slot of the corresponding level
						sourcespells[`spell${level}`].value += 1;
					} else
					{
						// If 3rd level or greater than add a 3rd level slot
						sourcespells[`spell3`].value += 1;
					}
					await act.update(actor_data);
					// If we had to override a spell slot of 3rd level (meaning pact spell of 4th or 5th level and no regular 3rd level spell slot)
					if (sourcespells.spell3.override = 1){
						// Create a hook when actor is updated checking for the actor, all 3rd level slots spent, an override on 3rd level spells and for the Pearl of Power effect, then delete the effect
						const myhook = Hooks.on(`updateActor`, (actorroll, data, options, usedID) => {
							if(actorroll.data._id == `${act.data._id}` && actorroll.data._source.data.spells.spell3.value == 0 && actorroll.data._source.data.spells.spell3.override == 1){
								let efeito = actorroll.effects.find(i => i.data.label === "Pearl of Power");
								if (efeito){
									efeito.delete();
								}
							}
						});
						// Define effect on user of Pearl of Power, storing the Hook index to later delete it
						const effectData = {
						  changes: [{key: "macro.execute", mode: 1, value: `"Pearl of Power" ${myhook}`, priority: 0}],
						  origin: args[0].itemUuid,
						  disabled: false,
						  duration: {startTime: game.time.worldTime},
						  icon: args[0].item.img,
						  label: args[0].item.name,
						  flags: {"dnd5e-helpers" : {"rest-effect" : "Short Rest"}}
						}
						await act.createEmbeddedDocuments("ActiveEffect", [effectData]);						
					}
				}
			},
		},
		default: 'yes',
		close: () =>
		{
		}
	}).render(true);
};
