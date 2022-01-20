function printMessage(message){
	let chatData = {
		user : game.user._id,
		content : message,
		//blind: true,
		whisper : game.users.entities.filter(u => u.isGM).map(u => u._id)
	};

	ChatMessage.create(chatData,{});	
}


function OutputManySameDice(dicearray){
	let output = `
<div class="dice-roll">
	<div class="dice-result">
		<div class="dice-formula">${dicearray.length}d${dicearray[0].dice[0].faces} + 8</div>
		<div class="dice-tooltip">
			<section class="tooltip-part">
				<div class="dice">
					<header class="part-header flexrow">
					<span class="part-formula">${dicearray.length}d${dicearray[0].dice[0].faces}</span>`

	for (var i = 0; i < dicearray.length; i++) {
		output += `
						<span class="part-total">${dicearray[i].terms[0].results[0].result}</span>`
	}

	output = output + `
						</header>
						<ol class="dice-rolls">`

	for (var i = 0; i < dicearray.length; i++) {
		if (dicearray[i].terms[0].results[0].result == 1) {
			output += `<li class="roll die d${dicearray[i].dice[0].faces} min">${dicearray[i].terms[0].results[0].result}</li>`
		}
		else if (dicearray[i].terms[0].results[0].result == dicearray[i].dice[0].faces){
			output += `<li class="roll die d${dicearray[i].dice[0].faces} max">${dicearray[i].terms[0].results[0].result}</li>`
		}
		else{
			output += `<li class="roll die d${dicearray[i].dice[0].faces}">${dicearray[i].terms[0].results[0].result}</li>`
		}
	}
	output = output + `    
					</ol>
				</div>
			</section>
		</div>
		`

	for (var i = 0; i < dicearray.length; i++) {
		if (dicearray[i].terms[0].results[0].result == 1) {
			output += `<h4 class="dice-total fumble">${dicearray[i].total}</h4>`
		}
		else if (dicearray[i].terms[0].results[0].result == dicearray[i].dice[0].faces){
			output += `<h4 class="dice-total critical">${dicearray[i].total}</h4>`
		}
		else{
			output += `<h4 class="dice-total">${dicearray[i].total}</h4>`
		}
	}

	output += `
	</div>
</div>`

	return output
}





//Launch Dialog message with a counter from 1-10 for the number of dice to roll
new Dialog({
	title: `Animate Objects (tiny)`,
	content: `
		<form>
			<div style="display: inline-block; width: 100%; margin-bottom: 10px">
				<label for="output-options" style="margin-right: 10px">Number of Objects:</label>
				<select id="output-options" />
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
					<option value="9">9</option>
					<option value="10">10</option>
				</select>
			</div>
		</form>
	`,
	buttons: {
		yes: {
			icon: "<i class='fas fa-check'></i>",
			label: `Attack`,
			callback: (html) => {
				let count = html.find('#output-options').val();
				let rolls = [];
				let debugOutput = "";

				//Do attack Rolls
				for (var i = 0; i < count; i++) {
					let roll = new Roll(`1d20+8`);

					rolls.push(roll.evaluate());
					//console.log(rolls);
					//console.log(rolls[rolls.length - 1].terms);

					debugOutput = debugOutput.concat(rolls[rolls.length - 1].total);
					debugOutput = debugOutput.concat(" ");
				}
				//console.log(debugOutput);
				printMessage("Animated Weapons (tiny) Attacks: " + OutputManySameDice(rolls));

			}
		},
		no: {
			icon: "<i class='fas fa-times'></i>",
			label: `Cancel`
		},
	},
	default: "yes"
}).render(true)