/* This macro is specific to the AGE System (unoffical) game system.
 *
 * This macro requires that the game system be "age-system" so that
 * the actor will have the appropriate structure.
 * 
 * Author: schlosrat
 */

if (game.system.id === 'age-system') {

    // Get the list of all the selected tokens
    const selected = canvas.tokens.controlled;
    
    // For each selected token...
    selected.forEach(token => {

        // Get the actor for this token
        let ageSystemActor = token.actor;
        
        // Set the flavor to use in the chat message
        let flavor = "All set, boss!"
        if (ageSystemActor.data.data.ancestry === "Belter") flavor = "Kowl set, bosmang!";
        // Get the abilities for this actor
        // let abilities = ageSystemActor.data.data.abilities;
        
        // Record the actor's current CON value
        let conValue = ageSystemActor.data.data.abilities.cons.value;
        
        // Check for a baseConValue flag
        let baseCon = ageSystemActor.getFlag("world", "baseConValue");
        
        // If there is a baseConValue flag set...
        if (baseCon != undefined) {
            // And if the current CON is less than the baseConValue
            if (conValue < baseCon) {
                conValue = baseCon;
            }
        }
        
        // Do all the updates in a single call to minimize trips to the backend
        ageSystemActor.update({
            "data": {
                "conditions.blinded": false,
                "conditions.deafened": false,
                "conditions.dying": false,
                "conditions.exhausted": false,
                "conditions.fatigued": false,
                "conditions.freefalling": false,
                "conditions.helpless": false,
                "conditions.hindered": false,
                "conditions.injured": false,
                "conditions.prone": false,
                "conditions.restrained": false,
                "conditions.unconscious": false,
                "conditions.wounded": false,
                "abilities.cons.value": conValue,
            }
        });

        // Get the speaker for this token
        let this_speaker = ChatMessage.getSpeaker({token: token});

        // Send a friendly chat message from this token
        ChatMessage.create({speaker: this_speaker, content: flavor}); // All set, boss!
    });
}
