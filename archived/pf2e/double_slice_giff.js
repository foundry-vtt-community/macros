//Created by u/Griff4218
//----------------Variable Declaration---------------------
var user = token;
var targetSelected = false;
var targetArray = Array.from(game.user.targets);
var target;

var map = 2
var attackMod1 = 0
var attackMod2 = 0;
var attack1Crit = false;
var attack1Hit = false
var attack2Crit = false;
var attack2Hit = false
var attack1CritMiss = false;
var attack2CritMiss = false;
var selectedWeapon1Action;
var selectedWeapon2Action;
var weapons = [];

var targetAC = 0;

//-------------------execution-----------------------------
if(!user){ //if no token is selected, show an error
    ui.notifications.error("No token selected, please select the token that will use this ability");
}else{
    //if no target selected show a info notification
    if(targetArray[0]){
        target = targetArray[0].actor.data;
        targetSelected = true;
    }else{
        ui.notifications.info("Tip: You can target another creature to automatically compare your attacks to its AC");
    }

    //check if the actor has any weapons that meet the requirements
    weapons = GetEligableItems(user.actor.data.items);
    if(weapons.length < 2 ){
        ui.notifications.error("This actor is not holding enough weapons. Make sure to equip your weapons in your inventory");
        return 0;
    }

	if(weapons[0]){
		if(CheckFeat()){
           
			SelectWeapon();
		}
	}else{
		ui.notifications.error("This actor has no weapons which meet the requirements for this ability");
	}
}

//------------------Functions begin------------------------
function toChat(content){
    let chatData = {
        user: game.user.id,
        content,
        speaker: ChatMessage.getSpeaker(),
    }
    ChatMessage.create(chatData, {})
   
    
}

//Determines if the Actor selected as the user has the requisite feat to use the ability, returns true if it does and false if it does not
function CheckFeat() {
	let items = user.actor.data.items;
	let hasFeat = false;

	for(let i = 0; i < items.length; i++){
		if(items[i].name === "Double Slice"){
				hasFeat = true;
				return true;
		}
	}
	
	if(!hasFeat){
		ui.notifications.error('This Creature does not have the Feat required to use this ability');
		return false;
	}
}

//Creates and returns an array of all items that can be used for Double Slice (Equipped 1 handed weapons)
function GetEligableItems(inv){
	let EligableItems = [];
	let f = 0;
	
	for(let i = 0; i < inv.length; i++){
		
		if(inv[i].data.equipped && inv[i].data.equipped.value && inv[i].data.hands && (inv[i].data.hands.value === "" || inv[i].data.hands.value === "1")){
			EligableItems[f] = inv[i];
			f++;
		}
	}
	
	return EligableItems;
}

//if the user has more than one elligable weapon, this funtion displays a dialoge to allow them to select which one to use
function SelectWeapon(){
    let options = '';
    
    //automatically propegates the selection menu for the dialouge with the available weapons
    for(let i = 0; i < weapons.length; i++){
        options += "<option value='" + i + "'>"+weapons[i].name+"</option>";
    }
    
    //Dialouge control
    let applyChanges = false;
    new Dialog({
        title: "Weapon Selection",
        content: `
            <div>Please select the order you want to use your weapons in<div>
            <hr/>
            <form>
            <div class="form-group">
                <label for="List">First Attack:</label>
                <select id="Weapon-List1" name="Weapon-List1">
                    `+options+`
                </select>
            </div>
            <div class="form-group">
                <label for="List">Second Attack:</label>
                <select id="Weapon-List2" name="Weapon-List2">
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
                let first = html.find('[name="Weapon-List1"]')[0].value || 0;
                let second = html.find('[name="Weapon-List2"]')[0].value || 0;
                prepareWeapons(weapons[first], weapons[second]);
            }
        }
    }).render(true);
    
}

function prepareWeapons(selectedWeapon1, selectedWeapon2){

    //Double Slice only allows for 2 different weapons. If the same weapon is chosen for both attacks, show an error
    if(selectedWeapon1._id === selectedWeapon2._id){
        ui.notifications.error("You must use two different weapons for these strikes");
        return;
    }

    //Assign the actions for each of the weapons
    user.actor.data.data.actions.forEach(element => {
        if(element.item === selectedWeapon1._id){
            selectedWeapon1Action = element;
        }else if(element.item === selectedWeapon2._id){
            selectedWeapon2Action = element;
        }
    });


    //Determine if the second weapon has the Agile trait
    selectedWeapon2.data.traits.value.forEach(element => {
        if(element === "agile"){
            map = 0;
        }
    });
    
    //Assign attack modifiers
    attackMod1 = selectedWeapon1Action.totalModifier;
    attackMod2 = selectedWeapon2Action.totalModifier;

    //assign target ac
    if(targetSelected){
        targetAC = target.data.attributes.ac.value;
    }

    RollAttacks()

}

function handleCrits(roll){
    if(roll === 1){
        return -10;
    }else if(roll === 20){
        return 10;
    }

    return 0;
} 

function RollAttacks(){
    let message = '';
    let name = user.actor.data.name;
    
	const roll1 = new Roll('d20').roll().total;
	const roll2 = new Roll('d20').roll().total;
	
	const crit1 = handleCrits(roll1)
	const crit2 = handleCrits(roll2)
    
    //A lot of If statements to change messages displayed based on the results of each attack roll
	if(targetAC === 0){ //targetAC is set to 0 by default, if it stays 0 we assume that no target is selected and do not compare to any AC
		message = name + ' Rolls a ' + (roll1 + attackMod1);
			if(crit1 === 10){
				message += '[Natural 20]';
			}else if(crit1 === -10){
				message += '[Natural 1]';
			}else{
				message += "[" + roll1 + "+" + attackMod1 + "]";
			}	
		message += ' on their first attack and a ' + (roll2 + attackMod2 - map);
			if(crit2 === 10){
				message += '[Natural 20]';
			}else if(crit2 === -10){
				message += '[Natural 1]';
			}else{
				message += "[" + roll2 + "+" + attackMod2 + "-" + map + "]";
			}
        message += ' on their scond attack.';

        toChat(message);

        selectedWeapon1Action.damage();
        selectedWeapon2Action.damage();

	}else{
		if(roll1 + crit1 + attackMod1 >= targetAC+10){//Different messages display on a Crit, Hit, and Miss for each attack, and the damage rolls are set accordingly
			message += (name + ' Crits on the First attack with a ' + (roll1 + attackMod1));
            attack1Crit = true;
		}else if(roll1 + crit1 + attackMod1 >= targetAC){
			message += (name + ' Hits on the First attack with a ' + (roll1 + attackMod1));
            attack1Hit = true;
        }else if(roll1 + crit1 + attackMod1 <= targetAC-10){
			message += (name + ' Critically misses on the First attack with a ' + (roll1 + attackMod1));
            attack1CritMiss = true;
		}else{
			message += (name + ' Misses the First attack with a ' + (roll1 + attackMod1));
		}
		if(crit1 === 10){
			message += '[Natural 20]';
		}else if(crit1 === -10){
			message += '[Natural 1]';
		}else{
			message += "[" + roll1 + "+" + attackMod1 + "]";
		}	
		
		if(roll2 + crit2 + attackMod2 - map >= targetAC+10){
			message += (' and Crits on the Second attack with a ' + (roll2 + attackMod2 - map));
			attack2Crit = true
			
		}else if(roll2 + crit2 + attackMod2 - map >= targetAC){
			message += (' and Hits on the Second attack with a ' + (roll2 + attackMod2 - map));
            attack2Hit = true;
        }else if(roll2 + crit2 + attackMod2 - map <= targetAC-10){
			message += (name + ' Critically misses on the Second attack with a ' + (roll2 + attackMod2 - map));
            attack2CritMiss = true;
		}else{
			message += (' and Misses the Second attack with a ' + (roll2 + attackMod2 - map));

		}
		if(crit2 === 10){
			message += '[Natural 20]';
		}else if(crit2 === -10){
			message += '[Natural 1]';
		}else{
			message += "[" + roll2 + "+" + attackMod2 + "-" + map + "]";
        }	

        //display message and Rolls
        toChat(message);
        if(attack1Crit){
            selectedWeapon1Action.critical();
        }else if(attack1Hit){
            selectedWeapon1Action.damage();
        }

        if(attack2Crit){
            selectedWeapon2Action.critical();
        }else if(attack2Hit){
            selectedWeapon2Action.damage();
        }

        //if both attacks miss, go to dual onslaught
        if(!attack1Crit && !attack1Hit && !attack2Crit && !attack2Hit){
            dualOnslaught();
        }
	}
	
}

function dualOnslaught(){
    let items = user.actor.data.items;
	let hasFeat = false;

    //check if user has the Dual Onslaught feat
	for(let i = 0; i < items.length; i++){
		if(items[i].name === "Dual Onslaught"){
				hasFeat = true;
				break;
		}
    }
    
    if(hasFeat){
        let i = 0;
        let options = "";

        //A weapon cannot be used if its attack was a critical miss. Add attacks that missed, but not critically so, to the list of attacks to choose
        if(!attack1CritMiss){
            options += "<option value='" + "first" + "'>"+selectedWeapon1Action.name+"</option>";
            i++;
        }
        if(!attack2CritMiss){
            options += "<option value='" + "second" + "'>"+selectedWeapon2Action.name+"</option>";
            i++;
        }

        if(i===0){
            return;
        }
        
        //Display a dialog for the user to pick the attack to apply the hit from
        let applyChanges = false;
        new Dialog({
            title: "Dual Onslaught",
            content: `
                <div>You've missed both Attacks! Select one of them to apply the effects of. Attacks where you critically miss cannot be used.<div>
                <hr/>
                <form>
                <div class="form-group">
                    <label for="List">Weapon:</label>
                    <select id="Weapon-List1" name="Weapon-List1">
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
                    let choice = html.find('[name="Weapon-List1"]')[0].value || 0;

                    if(choice === "first"){
                        selectedWeapon1Action.damage();
                    }else{
                        selectedWeapon2Action.damage();
                    }
                }
            }
        }).render(true);
    }
}