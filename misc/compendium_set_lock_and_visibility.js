/* 
* Made by foundry discor user: Freeze#2689
* this Macro is for people that want to change the visibility and/or lock on their Compendium,
* or all of their Compendia at once.
* As always when doing mass changes to your world. MAKE A BACKUP, you were warned.
* That said I anticipate no issues, just put this code in a macro on your hotbar and click.
*/

async function changeSetting(lock, priv, key){
    let value = game.settings.get("core", "compendiumConfiguration");
    value[key] = {private: priv, locked: lock};
    await game.settings.set("core", "compendiumConfiguration", value);
}
async function changeAllSettings(lock, priv) {
    let value = {};
    for(let pack of game.packs) {
        value[pack.collection] = {private: priv, locked: lock};
    }
    await game.settings.set("core", "compendiumConfiguration", value);
}



function onChange(html) {
    let pack = game.packs.get(html.value);
    // console.log(pack)
    if(pack.private){
        if (!$("#compendia-changer-dialog .private-checkbox").prop("checked")){
            $("#compendia-changer-dialog .private-checkbox").prop("checked", true);
        }
    }
    else {
        if ($("#compendia-changer-dialog .private-checkbox").prop("checked")){
            $("#compendia-changer-dialog .private-checkbox").prop("checked", false);
        }
    }
    if(pack.locked){
        if (!$("#compendia-changer-dialog .locked-checkbox").prop("checked")){
            $("#compendia-changer-dialog .locked-checkbox").prop("checked", true);
        }
    }
    else {
        if ($("#compendia-changer-dialog .locked-checkbox").prop("checked")){
            $("#compendia-changer-dialog .locked-checkbox").prop("checked", false);
        }
    }
    
}


let packs = game.packs.contents;
let options = packs.reduce((acc, p) => acc += `<option value="${p.collection}">${p.metadata.label}</option>`, ``);
let checkedPrivate = packs[0].private ? "checked" : "";
let checkedLocked = packs[0].locked ? "checked" : "";
const content = `<form>
                    <div class="form-group">
                        <label>Pack name: </label>
                        <select name="pack-key" class="compendium-select">${options}</select>
                    </div>
                    <div class="form-group">
                        <label>Private ?</label>
                        <input type="checkbox" class="private-checkbox" name="private-setting" ${checkedPrivate}>
                    </div>
                    <div class="form-group">
                        <label>Locked ?</label>
                        <input type="checkbox" class="locked-checkbox"name="locked-setting" ${checkedLocked}>
                    </div>
                </form>`;

new Dialog({
    title: "Set locked / private for Compendia",
    content,
    buttons: {
        change: {
            label: "Change!",
            callback: (html) => {
                const lock = html.find("[name=locked-setting]")[0].checked;
                const priv = html.find("[name=private-setting")[0].checked;
                const key =  html.find("[name=pack-key]")[0].value;
                changeSetting(lock, priv, key);
            }
        },
        changeAll: {
            label: "Change ALL!",
            callback: (html) => {
                const lock = html.find("[name=locked-setting]")[0].checked;
                const priv = html.find("[name=private-setting")[0].checked;
                changeAllSettings(lock, priv);
            }
        },
        cancel: {
            label: "Cancel"
        }
    },
    default: "cancel"
},
{
    id: "compendia-changer-dialog"
}).render(true);

await new Promise(resolve => {setTimeout(resolve, 150)});
$(document).ready(function () {
    $("#compendia-changer-dialog .compendium-select").change(function (){
        onChange(this);
    });
});
