//Created by u/Griff4218

//------------------Functions begin------------------------
let toChat = (content, rollString) => {
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
    if (rollString) {
        let roll = new Roll(rollString).roll();
        chatData = {
            ...chatData,
            flavor: "Hunted Shot Damage",
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
            roll
          }
        ChatMessage.create(chatData, {})
    }
    
}

const handleCrits = (roll) => roll === 1 ? -10 : (roll === 20 ? 10 : 0);

let RollAttacks = (args) => {
	let {targetAC, bonus, name, weapon} = args;
	
	var message = '';
	var damage = '';
	
	const roll1 = new Roll('d20').roll().total;
	const roll2 = new Roll('d20').roll().total;
	
	const crit1 = handleCrits(roll1)
	const crit2 = handleCrits(roll2)

	if(map === ""){
		map = 5;

		weapon.data.traits.value.forEach(element => {
			if(element === "agile"){
				map = 4;
			}
		});
	}
	
	//A lot of If statements to change messages displayed based on the results of each attack roll
	if(targetAC === 0){ //targetAC is set to 0 by default, if it stays 0 we assume that no target is selected and do not compare to any AC
		message = name + ' Rolls a ' + (roll1 + bonus);
			if(crit1 === 10){
				message += '[Natural 20]';
			}else if(crit1 === -10){
				message += '[Natural 1]';
			}else{
				message += "[" + roll1 + "+" + bonus + "]";
			}	
		message += ' on their first attack and a ' + (roll2 + bonus - map);
			if(crit2 === 10){
				message += '[Natural 20]';
			}else if(crit2 === -10){
				message += '[Natural 1]';
			}else{
				message += "[" + roll2 + "+" + bonus + "-" + map + "]";
			}
		message += ' on their scond attack.';
		damage += weaponDamage + "+" + weaponDamage;
	}else{
		if(roll1 + crit1 + bonus >= targetAC+10){//Different messages display on a Crit, Hit, and Miss for each attack, and the damage rolls are set accordingly
			message += (name + ' Crits on the First attack with a ' + (roll1 + bonus));
			damage += weaponDamage+'*2';
			weaponTraits.forEach(element => {
				if(element.includes("deadly")){
					var deadly = element.split('-');
					damage += "+" + deadlyDamage + deadly[1];
				}
			});
		}else if(roll1 + crit1 + bonus >= targetAC){
			message += (name + ' Hits on the First attack with a ' + (roll1 + bonus));
			damage += weaponDamage;
		}else{
			message += (name + ' Misses the First attack with a ' + (roll1 + bonus));
			damage += '0';
		}
		if(crit1 === 10){
			message += '[Natural 20]';
		}else if(crit1 === -10){
			message += '[Natural 1]';
		}else{
			message += "[" + roll1 + "+" + bonus + "]";
		}	
		
		if(roll2 + crit2 + bonus - map >= targetAC+10){
			message += (' and Crits on the Second attack with a ' + (roll2 + bonus - map));
			damage += '+'+weaponDamage+'*2';
			weaponTraits.forEach(element => {
				if(element.includes("deadly")){
					var deadly = element.split('-');
					damage += "+" + deadlyDamage + deadly[1];
				}
			});
		}else if(roll2 + crit2 + bonus - map >= targetAC){
			message += (' and Hits on the Second attack with a ' + (roll2 + bonus - map));
			damage += "+" + weaponDamage;
		}else{
			message += (' and Misses the Second attack with a ' + (roll2 + bonus - map));
			damage += '+0';
		}
		if(crit2 === 10){
			message += '[Natural 20]';
		}else if(crit2 === -10){
			message += '[Natural 1]';
		}else{
			message += "[" + roll2 + "+" + bonus + "-" + map + "]";
		}	
	}
	
	//display message and Rolls
	toChat(message, damage);
}

//Determines if the Actor selected as the user has the requisite feat to use the ability, returns true if it does and false if it does not
function CheckFeat() {
	var items = token.actor.data.items;
	var hasFeat = false;

	for(var i = 0; i < items.length; i++){
		if(items[i].name === "Hunted Shot"){
				hasFeat = true;
				return true;
		}
	}
	
	if(!hasFeat){
		ui.notifications.error('This Creature does not have the Feat required to use this ability');
		return false;
	}
}

//Creates and returns an array of all items that can be used for Hunted Shot (Ranged weapons with Reload 0)
function GetEligableItems(inv){
	var EligableItems = [];
	var f = 0;
	
	for(var i = 0; i < inv.length; i++){
		
		if(inv[i].data.range && inv[i].data.range.value > 10 && inv[i].data.reload && (inv[i].data.reload.value === "" || inv[i].data.reload.value === "0")){
			EligableItems[f] = inv[i];
			f++;
		}
	}
	
	return EligableItems;
}

//Actually executes most of the script
//In charge of Creating a dialouge for the user to select a weapon to use, setting attack variables to what they should be based on the selected weapon, and calling the RollAttacks function
//Should probably clean up this entire function but eh
function SelectWeapon(){
	
	//if there is more than 1 item that is viable to be used, create a dialouge for the user to select which one to use
	if(weapons.length > 1){
		var options = '';
		
		//automatically propegates the selection menu for the dialouge with the available weapons
		for(var i = 0; i < weapons.length; i++){
			options += "<option value='" + i + "'>"+weapons[i].name+"</option>";
		}
		
		//Dialouge control
		let applyChanges = false;
		new Dialog({
		  title: "Weapon Selection",
		  content: `
			<div>Please select the weapon you are using for these attacks<div>
			<hr/>
			<form>
			  <div class="form-group">
				<label for="List">Weapon:</label>
				<select id="Weapon-List" name="Weapon-List">
					`+options+`
				</select>
			  </div>
			</form>
			`,
		  buttons: {
			yes: {
			  icon: "<i class='fas fa-check'></i>",
			  label: `Select Weapon`,
			  callback: () => applyChanges = true
			},
			no: {
			  icon: "<i class='fas fa-times'></i>",
			  label: `Cancel`
			},
		  },
		  default: "yes",
		  close: html => {
			if (applyChanges) {
			  for ( let token of canvas.tokens.controlled ) {

				//begin spaghetti code
				//set the selected weapon to that chosen by the dialouge
				var sel = html.find('[name="Weapon-List"]')[0].value || 0;
				var selectedWeapon = weapons[sel];

				for(var i = 0; i < selectedWeapon.data.traits.value.length; i++){
									weaponTraits[i] = selectedWeapon.data.traits.value[i];
								}
				//set the number of dice for the attack roll equal to the number set in the items data sheet
				var diceNumber = selectedWeapon.data.damage.dice;
				if(selectedWeapon.data.strikingRune.value != ""){
					//modify the number of dice based on the weapons striking rune
					switch(selectedWeapon.data.strikingRune.value){
						case "striking": diceNumber += 1; deadlyDamage = 1;
							break;
						case "greaterStriking": diceNumber += 2; deadlyDamage = 2;
							break;
						case "majorStriking": diceNumber += 3; deadlyDamage = 3;
							break;
					}
				}
				
				//set the weaponDamage string equal to the diceNumber plus the die size, format is "XdY" where X is the number of dice and Y is the size of the die such as d6
				weaponDamage = diceNumber + selectedWeapon.data.damage.die;
				weaponTraits.forEach(element => {
					if(element === "propulsive"){
						weaponDamage += "+";
						if(token.actor.data.data.abilities.str.mod > 0){
							weaponDamage += Math.ceil(token.actor.data.data.abilities.str.mod/2);
						}
					}
				});
				//set the Multiple Attack Penalty equal to that found on the weapons data sheet
				map = selectedWeapon.data.MAP.value;
				//determines the weapons attack modifier
				AttackMod = 0;
				if(selectedWeapon.data.ability.value === "dex"){
					AttackMod += token.actor.data.data.abilities.dex.mod;
				}else{
					AttackMod += token.actor.data.data.abilities.str.mod;
				}
				if(selectedWeapon.data.weaponType.value === "martial"){//Note: if your character has a differnt prficiency in specific weapon groups (like a fighter would) this script will not accurately calculate your proficiency
					AttackMod += token.actor.data.data.martial.martial.value;
				}else{
					AttackMod += token.actor.data.data.martial.simple.value;
				}
				if(selectedWeapon.data.potencyRune.value != ""){
					AttackMod += parseInt(selectedWeapon.data.potencyRune.value);
				}
				
				for(var i = 0; i < selectedWeapon.data.traits.value.length; i++){
					weaponTraits[i] = selectedWeapon.data.traits.value[i];
				}
				//
				if(targetSelected){
					targetAC = target.data.attributes.ac.value;
				}
				console.log(selectedWeapon)
				RollAttacks({targetAC: targetAC, bonus: AttackMod, name: token.actor.data.name, weapon: selectedWeapon});

			  }
			}
		  }
		}).render(true);
	}else{

		//same as the similar above section should probably make this a function
		var selectedWeapon = weapons[0];

		var diceNumber = selectedWeapon.data.damage.dice;
		if(selectedWeapon.data.strikingRune.value != ""){

			switch(selectedWeapon.data.strikingRune.value){
				case "striking": diceNumber += 1; 
					break;
				case "greaterStriking": diceNumber += 2;
					break;
				case "majorStriking": diceNumber += 3; 
					break;
			}
		}
	
		weaponDamage = diceNumber + selectedWeapon.data.damage.die;
		map = selectedWeapon.data.MAP.value;
		AttackMod = 0;
		if(selectedWeapon.data.ability.value === "dex"){
			AttackMod += token.actor.data.data.abilities.dex.mod;
		}else{
			AttackMod += token.actor.data.data.abilities.str.mod;
		}
		if(selectedWeapon.data.weaponType.value === "martial"){//Note: if your character has a differnt prficiency in specific weapon groups (like a fighter would) this script will not accurately calculate your proficiency
			AttackMod += token.actor.data.data.martial.martial.value;
		}else{
			AttackMod += token.actor.data.data.martial.simple.value;
		}
		if(selectedWeapon.data.potencyRune.value != ""){
			AttackMod += parseInt(selectedWeapon.data.potencyRune.value);
		}
				
		if(targetSelected){
			targetAC = target.data.attributes.ac.value;
		}
		console.log(selectedWeapon)
		//Check if the user has the feat
		RollAttacks({targetAC: targetAC, bonus: AttackMod, name: token.actor.data.name, weapon: selectedWeapon});
	}
}
//-----------------Functions End----------------

//if no token is selected, show an error
if(!token){
	ui.notifications.error("No token selected, please select the token that will use this ability");
}else{
	
	//Variable Declaration
	var weaponDamage = '1d4'
	var map = 5
	var AttackMod = 0
	var weaponTraits = [];
	var deadlyDamage = 1;
	
	var targetAC = 0;
	
	var targetSelected = false;
	var targetArray = Array.from(game.user.targets);
	
	//if no target selected show a info notification
	if(targetArray[0]){
		var target = targetArray[0].actor.data;
		targetSelected = true;
	}else{
		ui.notifications.info("Tip: You can target another creature to automatically compare your attacks to its AC");
	}

	var weapons = GetEligableItems(token.actor.data.items);
	//check if the actor has any weapons that meet the requirements
	if(weapons[0]){
		if(CheckFeat()){
			SelectWeapon();
		}
	}else{
		ui.notifications.error("This actor has no weapons which meet the requirements for this ability");
	}
}