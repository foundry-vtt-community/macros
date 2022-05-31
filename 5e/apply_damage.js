// Displays a prompt which asks for an amount of damage to inflict
// Inflicts the input damage amount to all selected tokens

let content = `
  <form>
    <div class="form-group">
      <label for="id="damage-amount">Damage</label>
      <input id="damage-amount" type="number" name="inputField" autofocus>
    </div>
  </form>`

new Dialog({
  title: 'How much damage should be applied (negative for healing)?',
  content: content,
  buttons:{
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Damage`
    }
  },

  default:'yes',

  close: html => {
    let result = html.find('input[name=\'inputField\']');
    if (result.val() !== '') {
      let damage = result.val();
      let allSelected = canvas.tokens.controlled

      allSelected.forEach(selected => {
        let actor = selected.actor
        let hp = actor.data.data.attributes.hp.value
        let maxHp = actor.data.data.attributes.hp.max

        let updatedHp = damage > hp ? 0 : hp - damage

        actor.update({'data.attributes.hp.value': updatedHp > maxHp ? maxHp : updatedHp})

        console.log(actor)
      })
    }
  }
}).render(true);

(async () => {
await new Promise(resolve => setTimeout(resolve, 20));
let input = $('#damage-amount').focus();
})();
