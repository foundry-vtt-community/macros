// Requires furnace to work correctly.
// args[0] === name of character
// args[1] === "add","sub", or "use" 
//		"add" : adds 1 hit die if able to
//		"sub" : removes 1 hit die if able to
//		"use" : removes 1 hit die and heals actor for rolled amount

(async () => {
	const actor = game.actors.find(i => i.name === args[0]); 
    if (!actor) return ui.notifications.warn(`No Actor by that name available.`);
    const classItems = actor.data.items.filter(it => it.type === "class")
    if (!classItems.length) return ui.notifications.warn(`Actor has no class!`);
    if (classItems.length > 1) return ui.notifications.warn(`Actor has multiple classes! This is not (yet) supported.`);
    const classItem = classItems[0];
	
	if(args[1] === "add")
	{
		if (classItem.data.hitDiceUsed <= 0) return ui.notifications.warn(`You are at maximum Hitdie!`);

		const classItemUpdate = {
			_id: classItem._id,
			data: {
				hitDiceUsed: classItem.data.hitDiceUsed - 1,
			},
		};

		await actor.updateEmbeddedEntity("OwnedItem", classItemUpdate);
	}
	
	if(args[1] === "sub")
	{
		if (classItem.data.hitDiceUsed >= classItem.data.levels) return ui.notifications.warn(`You have no remaining hit dice to spend!`);

		const classItemUpdate = {
			_id: classItem._id,
			data: {
				hitDiceUsed: classItem.data.hitDiceUsed + 1,
			},
		};

		await actor.updateEmbeddedEntity("OwnedItem", classItemUpdate);
	}
	
	if(args[1] === "use")
	{
		if (classItem.data.hitDiceUsed >= classItem.data.levels) return ui.notifications.warn(`You have no remaining hit dice to spend!`);		
		const classItemUpdate = {
			_id: classItem._id,
			data: {
				hitDiceUsed: classItem.data.hitDiceUsed + 1,
			},
		};
		await actor.updateEmbeddedEntity("OwnedItem", classItemUpdate);
		
		const hitDieRoll = new Roll(`1${classItem.data.hitDice} + ${actor.data.data.abilities.con.mod}`);
		hitDieRoll.roll();
		hitDieRoll.toMessage({
			user : game.user._id,
			speaker : speaker,
			flavor : "Roll Hit Dice"
		});
		
		const actorUpdate = {
			data: {
				attributes: {
					hp: {
						value: Math.clamped(
							actor.data.data.attributes.hp.value + hitDieRoll.total,
							actor.data.data.attributes.hp.min,
							actor.data.data.attributes.hp.max
						)
					},
				},
			},
		};
		await actor.update(actorUpdate);
	}    
})();
