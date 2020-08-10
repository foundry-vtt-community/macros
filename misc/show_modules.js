/**
 * Show Modules - Shows currently installed modules in foundry. Added on behalf of @vance
 */
let mods = '';
game.modules.forEach(m => {
  let a = m.active ? 'Enabled' : 'Disabled';
  mods = mods.concat(`${m.id}: ${a}\n`);
});

let d = new Dialog({
  title: `Enabled Mods`,
  content: `<textarea style="height: 500px;" type="text" id="modslist" name="modslist">${mods}</textarea>`,
  buttons: {
    copy: {
      label: `Copy to clipboard`,
      callback: () => {
        $("#modslist").select();
        document.execCommand('copy');
      }
    },
    close: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Close`
    },
  },
  default: "close",
  close: () => {}
});

d.render(true);