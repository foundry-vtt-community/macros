/* This macro is specific to the AGE System (unoffical) game system.
 *
 * In AGE system games such as Modern AGE, The Expanse, etc., a
 * character can improve their defense score by "taking cover",
 * which can either happen if the character uses their move to
 * do so, or applies the "Take Cover" stunt.
 * 
 * This macro makes it a one-button click to remove the cover
 * active effect from all selected tokens.
 * 
 * This macro requires that the game system be "age-system"
 * since the effect applied is specific to that system.
 * 
 * Author: schlosrat
 */

// define removeNamedEffect function
async function removeNamedEffect(ageSystemActor, effectData) {
    // Look to see if there's already a Cover effect
    const item = ageSystemActor.data.effects.find(i =>i.label === effectData.label);
    if (item != undefined) {
        // Delete it if there is one
        const deleted = await ageSystemActor.deleteEmbeddedEntity("ActiveEffect", item._id); // Deletes one EmbeddedEntity
    }
}

async function clearCover () {
    if (game.system.id === 'age-system') {
        const effectData = {
            label : "Cover",
            icon : "icons/svg/shield.svg",
            duration: {rounds: 10},
            changes: [{
                "key": "data.defense.total",
                "mode": 2, // Mode 2 is for ADD.
                "value": 0,
                "priority": 0
            },{
                "key": "data.defense.mod",
                "mode": 2, // Mode 2 is for ADD.
                "value": 0,
                "priority": 0
            }]
        };
        const selected = canvas.tokens.controlled;
        // console.log(selected)
        selected.forEach(token => {
            removeNamedEffect(token.actor, effectData);
        })
    }
}

clearCover();