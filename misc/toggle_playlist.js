// get actual pl data from entries
let _playlistArray = game.playlists.entries;
let _applyChanges = false;
let _raw = `

<form>
    <div class="form-group">
        <label>Select Playlist:</label>
        <select id="playlist-selection" name="playlist-selection">
        {{#each this}}
            <option> {{this.data.name}} </option>
        {{/each}}
        </select>
    </div>
</form>
`
let _html = Handlebars.compile(_raw)
let d = new Dialog({
    title: "Playlist Toggle",
    content: _html(_playlistArray),
    buttons: {
        toggle: {
            icon: '<i class="fas fa-check"></i>',
            label: "Toggle Selected Playlist",
            callback: () => _applyChanges = true
        },
    },
    default: "toggle",
    close: html => {
        if (_applyChanges) {
            let _plName = html.find('[name="playlist-selection"]')[0].value || "none";
            let _pl = game.playlists.getName(_plName);
            if (_pl.playing) {
                // turn off
                _pl.stopAll();
            } else {
                // turn on
                _pl.playAll();
            }
        }
    }
}).render(true);
