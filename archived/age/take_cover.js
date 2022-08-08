/* This macro is specific to the AGE System (unoffical) game system.
 *
 * In AGE system games such as Modern AGE, The Expanse, etc., a
 * character can improve their defense score by "taking cover",
 * which can either happen if the character uses their move to
 * do so, or applies the "Take Cover" stunt.
 * 
 * This macro automates that process of applying a cover setting
 * to all the currently selected tokens based on a dialog box
 * used to select the cover value to be applied. The effect of
 * cover is implemented as an applied unique Active Effect - 
 * meaning the actor can only have on "Cover" effect active, and
 * applying a new one will remove the old one so that there is
 * only ever one active.
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

// define applyUniqueEffect function
async function applyUniqueEffect(ageSystemActor, effectData) {
    // Look to see if there's already a Cover effect
    removeNamedEffect(ageSystemActor, effectData);

    // Create a new fresh one with the new settings
    await ageSystemActor.createEmbeddedEntity("ActiveEffect", effectData); 
}

async function takeCover () {

    if (game.system.id === 'age-system') {
        // import applyUniqueEffect from './applyUniqueEffect.js';
        // import removeNamedEffect from './removeNamedEffect.js';

        let applyChanges = false;
        new Dialog({
            title: `Take Cover!`,
            content: `
                <form>
                    <div class="form-group">
                        <label>Cover Rating:</label>
                        <select id="cover-type" name="cover-type">
                            <option value="nochange">No Change</option>
                            <option value="0">No Cover</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                </form>
                `,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: `Apply Changes`,
                    callback: () => applyChanges = true
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: `Cancel Changes`
                },
            },
            default: "yes",
            close: html => {
                if (applyChanges) {
                    // Chat message to announce this effect
                    const flavor = "Leta-go cover!"; // LangBelta for "Take cover!"
                    
                    // const effect = 'icons/svg/blood.svg'; // path to effect img
                    const state = false; // true if turn on , false if turn off
                    
                    let coverVal = 0;
                    let coverType = html.find('[name="cover-type"]')[0].value || "none";
                    switch (coverType) {
                        case "0":
                            coverVal = 0;
                            break;
                        case "1":
                            coverVal = 1;
                            break;
                        case "2":
                            coverVal = 2;
                            break;
                        case "3":
                            coverVal = 3;
                            break;
                        case "nochange":
                        default:
                    }
                    
                    // NOTE! Currently (4/11/21) the AGE System (unofficial) doesn't fully support Active effects
                    // so at this time we need to to apply the effect in both .mod and .total so that it will both
                    // show up on the character sheet and have an effect. Once VKDolea updates AGE System to handle
                    // Active Effects correctly this (what we have below currently) will ilkely double the effect.
                    // When that time comes we will most likely need to trim this down to only affecting the .mod
                    const effectData = {
                        label : "Cover",
                        icon : "icons/svg/shield.svg",
                        duration: {rounds: 10},
                        changes: [{
                            "key": "data.defense.total",
                            "mode": 2, // Mode 2 is for ADD.
                            "value": coverVal,
                            "priority": 0
                        },{
                            "key": "data.defense.mod",
                            "mode": 2, // Mode 2 is for ADD.
                            "value": coverVal,
                            "priority": 0
                        }]
                    };
            
                    const selected = canvas.tokens.controlled;
                    // console.log(selected)
                    selected.forEach(token => {
                        if (coverVal) {
                            // Apply the cover effect
                            applyUniqueEffect(token.actor, effectData);
                        } else {
                            removeNamedEffect(token.actor, effectData);
                        }
                        // Announce the reset in chat
                        // let this_speaker = ChatMessage.getSpeaker(token);
                        // ChatMessage.create({speaker: this_speaker, content: flavor}); // All set, boss!
                        /**/
                    })
                }
            }
        }).render(true);
    }
}

takeCover();
