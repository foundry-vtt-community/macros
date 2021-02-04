//Created by Drental, based on a macro by u/Griff4218 

// ------------------ damage output ------------------

const handleCrits = (roll) => roll.terms[0].results[0] === 1 ? -1 : (roll.terms[0].results[0] === 20 ? 1 : 0);

const DoubleSliceDamage = (roll, strike, dos, targetAC) => {
    const crit = handleCrits(roll);
    var success = 1;

    if (roll._total >= targetAC + 10) {
        success = 3;
    } else if (roll._total >= targetAC) {
        success = 2;
    } else if (roll._total <= targetAC - 10) {
        success = 0;
    }
    dos.value =Math.max(3,Math.min(success+crit,0));
    if(dos.value === 2) {
        strike.damage({event: event});
    }
    if(dos.value === 3) {
        strike.critical({event: event});
    }
}

// ------------------ hit calculation ------------------
function DoubleSliceStrike(weapon1, weapon2) {
    let targetAC = 0;
    var strike1 = actor.data.data.actions.find(a => a.type === 'strike' && a.item === weapon1._id);
    var strike2 = actor.data.data.actions.find(a => a.type === 'strike' && a.item === weapon2._id);
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
            strike1.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike1, dosFirst, targetAC)}});
            strike2.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike2, dosSecond, targetAC)}});
        } else {
            strike1.attack({event: event, options: options});
            strike2.attack({event: event, options: options});
        }
    } else {
        (async () => {
            if (targetSelected) {
                strike1.attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike1, dosFirst, targetAC)}});
            } else {
                strike1.attack({event: event, options: options});
            }
            await actor.addCustomModifier(
                "attack",
                "Double Slice",
                -2,
                "untyped"
            );
            // get a new strike with the modifier
            if (targetSelected) {
                actor.data.data.actions.find(a => a.type === 'strike' && a.item === weapon2._id)
                    .attack({event: event, options: options, callback: (roll) => {DoubleSliceDamage(roll, strike2, dosSecond, targetAC)}});
            } else {
                actor.data.data.actions.find(a => a.type === 'strike' && a.item === weapon2._id)
                    .attack({event: event, options: options});
            }
            await actor.removeCustomModifier(
                "attack",
                "Double Slice"
            );

            // apply special feats
            if(CheckFeat('dual-onslaught', false)) {
                if (Math.max(dosFirst.value, dosSecond.value) === 1) {
                    let content = 'Dual Onslaught Damage'
                    let chatData = {
                        user: game.user.id,
                        content,
                        speaker: ChatMessage.getSpeaker(),
                    }
                    ChatMessage.create(chatData, {})
                    strike1.damage({event: event})
                }

            }
            if(CheckFeat('flensing-slice', false)) {
                if (dosFirst.value > 1 && dosSecond.value > 1) {
                    let content = 'Flensing Slice available'
                    let chatData = {
                        user: game.user.id,
                        content,
                        speaker: ChatMessage.getSpeaker(),
                    }
                    ChatMessage.create(chatData, {})
                }
            }
        })();
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