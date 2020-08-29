/**
 * Copies all of the items not in a folder to the targeted compendium
 * Change 'game.items.foreach' to another actors or journal to move something other than items.
 * Author: Aeternyx#3856
 * Note: Thanks to KrishMero#1792 for his macros which heavily influenced this.
 */

let packOptions = game.packs.filter(pack => !pack.locked).map(pack => `<option value="${pack.collection}">${pack.title}</option>`);
let entityType = COMPENDIUM_ENTITY_TYPES.map(type => `<option value="${type}">${type}</option>`);

const form = `
  <div style="display: inline-block; width: 100px">Compendium:</div>
  <select id="destinationPack" />
    ${packOptions}
  </select>
  <br />
<label>
    <input type="checkbox" id="deleteAfterMove" checked/>
    Delete after move to compendium
  </label>

`;

const dialog = new Dialog({
    title: "Store folder in compendium",
    content: form,
    buttons: {
        use: {
            label: "Apply",
            callback: storeFolder
        }
    }
}).render(true);

function storeFolder(html) {
    const destinationPack = html.find(`select#destinationPack`)[0].value;
    const deleteAfterInsert = html.find(`input#deleteAfterMove`)[0].checked;

    let packObject = game.packs.get(destinationPack);

    game.items.forEach(t => {
        if (!t.data.folder) {
            packObject.createEntity(t);
            if (deleteAfterInsert) {
                t.delete();
            }
        }
    });
}