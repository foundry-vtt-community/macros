// Get all playlists from contents and prepare choices

let optionsText = game.playlists.reduce((acc, e) => acc += `<option value="${e.id}">${e.name}</option>`, ``);
let _applyChanges = false;

let d = new Dialog({
    title: "Playlist Toggle",
    content: `
        <form>
            <div class="form-group">
                <label>Select Playlist:</label>
                <select id="playlist-selection" name="playlist-selection">` + optionsText + `</select>
            </div>
        </form>
        `,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Playlist Toggle",
            callback: () => _applyChanges = true
        },
        two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => _applyChanges = false
        }
    },
    default: "Cancel",
    close: html => {
        if (_applyChanges) {
            let _plId = html.find('[name=playlist-selection]')[0].value;
            let _pl = game.playlists.get(_plId);
            if(_pl) {
                if (_pl.playing) {
                    // turn off
                    _pl.stopAll();
                } else {
                    // turn on
                    _pl.playAll();
                }
            }
            else {
                ui.notifications.error(`No valid playlist selected.`);
            }            
        }
    }
}).render(true);