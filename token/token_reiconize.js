/*
The purpose of this macro is to trigger VTTA-Iconizer to update icons on tokens. This macro goes through
every actor in the game and changes the name of every item, feature, spell, etc. by adding a '~' to the end
then removing all of the '~' from the end. This does NOT update actors in a compendium.

This was developed primarily to update actors after updating a custom dictionary used by VTTA-Iconizer.

A dialog will be displayed to allow you to go forward with the update or cancel. Once the update starts, it will
run to completion. A dialog will be shown to indicate progress. Closing this dialog will not cancel the update
process and the dialog will reassert itself. When the process is complete, the dialog will indicate that it is
done and a button will be displayed to close the dialog.
*/

dialog_query()

function dialog_query() {
    let dialog_content = `<p>Is your world backed up? Do you wish to activate Iconizer?</p>`
    return new Dialog({
        title : `Reiconizer`,
        content : dialog_content,
        buttons : 
        {
            one :
            {
                icon :`<i class="fas fa-check"></i>`,
                label : "Continue",
                callback: () => { touch_actors() }
            },
            two : 
            {
                icon : `<i class="fas fa-times"></i>`,
                label : "Cancel",
                callback: () => {}
            }
        },
        default : "Cancel",
    }).render(true);
}

function dialog_working() {
    let dialog = new Dialog({
        title : `Reiconizer Working`,
        content : `<p>Task in progress</p>`,
        buttons : {  },
    }).render(true);
    return dialog
}

async function touch_actors() {
    let working = dialog_working()
    const total_actors = game.actors.entries.length
    for (actor of game.actors.entries) {
        working.data.content = `<p>Processed ${actor.name}</p>`, actor.name
        working.render(true)
        try {
           for (let item of actor.items.entries) {
               let update = {_id: item._id, name: item.name + '~'}
               await actor.updateEmbeddedEntity('OwnedItem', update)
               update.name = update.name.slice(0, update.name.indexOf('~'))
               await actor.updateEmbeddedEntity('OwnedItem', update)
           }
        }
        catch(err) {
           console.log("Error processing", actor.name, "ERROR:", err)
        }
    }

    working.data.content = ''
    working.data.title = 'Reiconizer Done'
    working.data.buttons = { one : { label : "Done" }  }
    working.render(true)
}
