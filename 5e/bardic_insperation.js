let bardinsp_data = null;

//Check if have Bardic Insperation

if (canvas.tokens.controlled.length == 1){
	//console.log(canvas.tokens.controlled);
	let owner_actor = canvas.tokens.controlled[0].actor;

	for (let item in owner_actor.data.items){
		if (item.name == "Bardic Inspiration"){
			bardinsp_data = item;
			break;
		}
	}
}

//Get the Target of Bardic Insperation
if (canvas.tokens._hover != null){
	let bardinsp_token = canvas.tokens._hover;


	const effect = bardinsp_token.actor.effects.entries;

	bardinsp_token.toggleEffect("systems/dnd5e/icons/skills/yellow_08.jpg");
}