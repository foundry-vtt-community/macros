/*
Author: stan#1549 (github.com/janssen-io)

Description:
Roll cascading dice instead of keeping track of ammunition.
Example:
  When you shoot ammunition, roll a d12. On a 1, it gets replaced with a d10.
  All the way down to a d4, after which you have a single shot left.
  On average this gives 12 + 10 + 8 + 6 + 4 + 1 = 41 shots (for a d12)
  If you need more than 61 shots (d20), then equip a second piece of the same
  ammunition and give it its own ammo die.
*/

(() => {
  if (!token) {
    ui.notifications.warn("No character selected!");
    return;
  }

  const dieMap = {
    20: 12,
    12: 10,
    10: 8,
    8: 6,
    6: 4,
    4: 1,
    1: 0
  }

  async function rollDie(html, ammo) {
    const ammoId = html[0].querySelector('input:checked')?.value;
    if (!ammoId) {
      ui.notifications.error("No ammunition selected.");
      return;
    }
    const diceInputs = Array.from(html[0].querySelectorAll('input[type=number]'));
    const dice = diceInputs.reduce((curr, input) => (curr[input.name] = input.value, curr), {});

    const die = dice[ammoId];
    const roll = new Roll(`1d${die}`);
    await roll.roll();
    dice[ammoId] = roll.total === 1 ? (dieMap[die] || die - 1) : die;
    token.actor.unsetFlag('world', 'ammunition-dice')
      .then(entity => entity.setFlag('world', 'ammunition-dice', dice));
    roll.toMessage({
      flavor: `[Ammunition roll] ${token.name} fires a(n) ${ammo.find(a => a.id == ammoId).name}!`
    });
  }

  function updateDice(html) {
    const diceInputs = Array.from(html[0].querySelectorAll('input[type=number]'));
    const dice = diceInputs.reduce((curr, input) => (curr[input.name] = input.value, curr), {});

    token.actor.unsetFlag('world', 'ammunition-dice')
      .then(entity => entity.setFlag('world', 'ammunition-dice', dice));
  }

  function createForm(ammo, dice) {
    const options = ammo.map(item => `
      <tr>
        <td><input type="radio" name="item" value="${item.id}" checked /></td>
        <td>${item.name}</td>
        <td>d<input type="number" name="${item.id}" value="${dice[item.id] || 12}" min="1" max="20" required ${game.user.isGM ? '' : 'disabled'}/></td>
      </td>
      `);
    return `<table><thead><tr><td></td><td>Ammunition</td><td>Die</td></tr></thead>${options.join('')}</table>`;
  }

  function createDialog(token) {
    const dice = token.actor.getFlag('world', 'ammunition-dice') || {};
    const ammunition = token.actor.items.filter(i => i.type == "consumable" && i.data.data.consumableType == "ammo");

    if (ammunition.length === 0) {
      ui.notifications.error("You have no ammunition.");
      return;
    }

    const form = createForm(ammunition, dice);

    return new Dialog({
      title: "Roll ammunition die",
      content: form,
      buttons: {
        yes: { label: "Roll", callback: async html => rollDie(html, ammunition) },
        no: (game.user.isGM ? { label: "Update", callback: html => updateDice(html) } : { label: "Cancel" })
      },
      default: (game.user.isGM ? 'no' : 'yes')
    }).render(true);
  }

  createDialog(token);

})();
