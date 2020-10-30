/**
 * Lets the user select one token to control from a list of selected tokens.
 * Useful when tokens are stacked atop one another in the scene.
 * (The user is expected to select the tokens before calling this macro.)
 */
function templateForOptions()
{
    let template = `<p>Select one token to control from the selected group.</p>
    <div class="form-group">
        <label for="selected">Pick Token:</label>
        <select id="selected" name="selected">`
            for ( let token of canvas.tokens.controlled ) {
                template += `<option value="${token.id}">${token.name}</option>`;    
            };

    template += `
        </select>
    </div>`;
    return template;
}

if (canvas.tokens.controlled.length > 1)
{
    let applyChanges = false;
    let tokenPicker = new Dialog({
        title: `Token Picker`,
        content: templateForOptions(),
        buttons: {
            pick: { 
                icon: "<i class='fas fa-check'></i>",
                label: "Pick", 
                callback: () => applyChanges = true },
            cancel: {                    
                icon: "<i class='fas fa-times'></i>",
                label: "Cancel", 
                callback: () => applyChanges = false }
        },
        close: html => {
            if (applyChanges) {
                let selectedID = html.find('#selected')[0].value;
                canvas.tokens.selectObjects([]);
                const observable = canvas.tokens.placeables.filter(t => t.id === selectedID);
                if (observable !== undefined)
                    observable[0].control();
        }}
    });
    
    tokenPicker.render(true);
}
else
    ui.notifications.warn("Select a group of tokens to pick from.");
