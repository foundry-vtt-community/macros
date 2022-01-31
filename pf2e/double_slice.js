// Heavily Refactored by willvk, based on macro by Drental, u/Griff4218 

// ------------------ damage output ------------------
const DoubleSliceDamage = (roll, strike, dos) => {
	dos.value = roll.data.degreeOfSuccess;

    if(roll.data.degreeOfSuccess === 2) {
        strike.damage({event: event});
    }
    if(roll.data.degreeOfSuccess === 3) {
        strike.critical({event: event});
    }
	pusher(dos);
}

// ------------------- result q ------------------------
function pusher(dos){
	resultQ.push(dos);
	if (resultQ.length == 2) {
		resulter();
	}
}	
	
// ------------------- check for followups -------------
function resulter(){

	if(CheckFeat('dual-onslaught', false)) {
		if (Math.max(resultQ[0].value, resultQ[1].value) === 1) {
			getContent('dual-onslaught');
		}
	}
	if(CheckFeat('flensing-slice', false)) {
		if (resultQ[0].value > 1 && resultQ[1].value > 1) {
			getContent('flensing-slice');
		}
	}
}

// ------------------ hide the filthy chat card ---------
function getContent(slug){
	let stuff = token.actor.items.find(i => i.data.data.slug === slug && i.type === 'feat').data
	let content = 
	`<div class="pf2e chat-card" style="text-align: center"><header class="card-header flexrow"><img width=75% height=50% src="${stuff.img}"</img>
	<h3 class="item-name">${stuff.name}</h3></div><div style="text-align: center">${stuff.data.description.value}`

	let chatData = {
		user: game.user.id,
		content,
		speaker: ChatMessage.getSpeaker(),
	}
	ChatMessage.create(chatData, {})
}
	
// ------------------ hit calculation ------------------
async function DoubleSliceStrike(weapon1, weapon2) {
    let targetAC = 0;
    var strike1 = actor.data.data.actions.filter(a => a.type === 'strike').find(b => b.item === weapon1.data._id);
    var strike2 = actor.data.data.actions.filter(a => a.type === 'strike').find(b => b.item === weapon2.data._id);
    if(targetSelected) {
        targetAC = target.data.attributes.ac.value;
    }
    var useAgile = (strike1.traits.find(i => i.name === 'agile') || strike2.traits.find(i => i.name === 'agile'));

    var options = actor.getRollOptions(['all','attack']);

    const dc = {value: targetAC};

    var dosFirst = {value: 0};
    var dosSecond = {value: 0};

    if (useAgile) {
        if (targetSelected) {
            strike1.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike1, dosFirst)}, dc: dc});
            strike2.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike2, dosSecond)}, dc: dc});
        } else {
            strike1.attack({event: event, options: options});
            strike2.attack({event: event, options: options});
        }
    } else {
		// first strike normal
		if (targetSelected) {
			strike1.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike1, dosFirst)}, dc: dc});
		} else {
			strike1.attack({event: event, options: options});
		}
		// second strike with the negative modifier
		await actor.addCustomModifier(
			"attack",
			"Double Slice",
			-2,
			"untyped"
		);
		strike3 = actor.data.data.actions.filter(a => a.type === 'strike').find(b => b.item === weapon2.data._id)
		if (targetSelected) {
			strike3.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike3, dosSecond)}, dc: dc});
		} else {
			strike3.attack({event: event, options: options});
		}
		await token.actor.removeCustomModifier('attack', 'double-slice');
	}
}

// ------------------ sanity check ------------------
const DoubleSliceCheck = ($html) => {
    var sel1 = parseInt($html.find('[name="Weapon-ListA"]')[0].value) || 0;
    var sel2 = parseInt($html.find('[name="Weapon-ListB"]')[0].value) || 0;
    if (sel1 !== sel2) {
        DoubleSliceStrike(weapons[sel1], weapons[sel2]);
    }
}

// ------------------ dialog function ------------------

//Query all user choices
//In charge of creating a dialog for the user to select the weapons to use
function DoubleSliceUI() {
    //if there is more than 2 item that is viable to be used, create a dialouge for the user to select which ones to use
    if(weapons.length > 2){
        var options = '';
        
        // create selection entries for weapon selection
        weapons.forEach((value,key,map) => {
            options += "<option value='" + key + "'>" + value.name + "</option>";
        });
        
        //Dialouge control
        let applyChanges = false;
        const dialogEditor = new Dialog({
            title: "Weapon Selection",
            content: `
                <div>Please select the weapons you are using for these attacks<div>
                <hr/>
                <form>
                <div class="form-group">
                    <label for="List">Mainhand Weapon:</label>
                    <select id="Weapon-ListA" name="Weapon-ListA">
                        ${options}
                    </select>
                </div>
                <div class="form-group">
                    <label for="List">Offhand Weapon:</label>
                    <select id="Weapon-ListB" name="Weapon-ListB">
                        ${options}
                    </select>
                </div>
                </form>
                `,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: `Select Weapon`,
                    callback: DoubleSliceCheck
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: `Cancel`
                },
            },
            default: "yes",
        })
        dialogEditor.render(true);
    }else{
        // it's exactly two weapons here
        DoubleSliceStrike(weapons["0"], weapons["1"]);
    }
}

// ------------------ helper functions ------------------

//Determines if the Actor selected as the user has the requisite feat to use the ability, returns true if it does and false if it does not
function CheckFeat(slug, required) {

    if(token.actor.items.find(i => i.data.data.slug === slug && i.type === 'feat')){
        return true;
    } else if (required) {
        ui.notifications.error('This Creature does not have the Feat required to use this ability');
        return false;
    }
    return false;
}

//Creates and returns an array of all items that can be used for Hunted Shot (Ranged weapons with Reload 0)
function GetWeapons(){
    let weapons
    
    weapons = actor.items.filter(i => i.type === 'weapon' 
                                    && i.data.data.equipped.value === true);
    
    return weapons;
}

// ------------------ execution ------------------

//if no token is selected, show an error
if(!token){
    ui.notifications.error("No token selected, please select the token that will use this ability");
}else{
    
    //Variable Declaration
    
    var targetSelected = false;
    var targetArray = Array.from(game.user.targets);
	var resultQ = [];
    
    //if no target selected show a info notification
    if(targetArray[0]){
        var target = targetArray[0].actor.data;
        targetSelected = true;
    }else{
        ui.notifications.info("Tip: You can target another creature to automatically compare your attacks to its AC");
    }

    var weapons = GetWeapons();
    //check if the actor has two melee weapons equipped
    if(weapons[1]){
        if(CheckFeat('double-slice', true)){
            DoubleSliceUI();
        }
    }else{
        ui.notifications.error("This actor has no weapons which meet the requirements for this ability");
    }
}
