/*
The purpose of this macro is to trigger VTTA-Iconizer to update icons on tokens. This macro goes through
every actor in the game and changes the name of every item, feature, spell, etc. by adding a '~' to the end
then removing the '~' from the end. This does NOT update actors in a compendium.

This was developed primarily to update actors after updating a custom dictionary used by VTTA-Iconizer.

A dialog will be displayed to allow you to go forward with the update or cancel. Once the update starts, a
new dialog will be shown with a cancel button. That cancel button is stupid and doesn't like to be clicked.
You'll have to click it a bunch to convince it to stop looping.
*/

let canceled = false
let totalItemsProcessed = 0
let totalActorsProcessed = 0

function CancelTouching() {
    canceled = true
}
DialogQuery()

function DialogResults() {
    let dialog = new Dialog({
        content: `<p>Processing of ${totalActorsProcessed} actors and ${totalItemsProcessed} items complete</p>`,
        title: 'Reiconizer Done',
        buttons: {
            one: {
                label: "Done"
            },
        },
    })
    dialog.render(true)
}

async function DialogQuery() {
    return new Dialog({
        title: `Reiconizer`,
        content: `<p>Is your world backed up? Do you wish to activate Iconizer?</p>`,
        buttons: {
            one: {
                icon: `<i class="fas fa-check"></i>`,
                label: "Continue",
                callback: async() => {
                    await TouchActors()
                    DialogResults()
                }
            },
            two: {
                icon: `<i class="fas fa-times"></i>`,
                label: "Cancel",
                callback: () => {}
            }
        },
        default: "Cancel",
    }).render(true);
}

function DialogWorking() {
    let dialog = new Dialog({
        title: `Reiconizer Working`,
        content: `<p>Task in progress</p>`,
        buttons: {
            one: {
                icon: `<i class="fas fa-times"></i>`,
                label: "Cancel (You might have to click me a bunch)",
                callback: () => {
                    CancelTouching()
                }
            },
        },
    })

    dialog.position.height = 'Auto'
    dialog.render(true)
    return dialog
}

async function TouchActors() {
    let working = DialogWorking()
    let remaining = game.actors.entries.length
    for (let _actor of game.actors.entries) {
        if (!canceled) {
            try {
                for (let item of _actor.items.entries) {
                    if (!canceled) {
                        working.data.content = `<p>Processing: ${_actor.name}</p><p>Remaining: ${remaining}</p><p>Item: ${item.name}</p>`
                        working.render(true)
                        let update = {
                            _id: item._id,
                            name: item.name + '~'
                        }
                        await _actor.updateEmbeddedEntity('OwnedItem', update)
                        update.name = update.name.slice(0, -1)
                        await _actor.updateEmbeddedEntity('OwnedItem', update)
                        totalItemsProcessed++
                    }
                }
            } catch (err) {
                console.log(`Error processing ${_actor.name}, ERROR: ${err}`)
            }
            remaining--
            totalActorsProcessed++
        }
    }

    working.close()
}
