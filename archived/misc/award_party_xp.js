function award_xp(type, amount)
{
  let actors = game.actors.filter(e => e.type === 'character' && e.hasPlayerOwner);
  let isShared = type == "shared";
  console.log(type + ' ' + amount);
  if (Number.isInteger(amount) && actors.length > 0)
  {
    let totalAmount = isShared ? amount : amount * actors.length;
    let individualAmount = isShared ? Math.floor(amount / actors.length) : amount

    let chatContent = `
    <b>${totalAmount} Experience Awarded!</b>
    <br>${individualAmount} added to:
    `;

    actors.forEach(actor =>
    {
      chatContent += `<br>${actor.name}`;
      actor.update({
        "data.details.xp.value": actor.data.data.details.xp.value + individualAmount
      });
    });

    let chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER
    };
    ChatMessage.create(chatData);
  }
}

new Dialog({
  title: "Award Party XP",
  content: `
    <p>Select a type and an amount. Individual xp will give or take a set amount to/from each party member, whereas shared will split an amount evenly.</p>
    <form>
    <div class="form-group">
      <label>Type:</label>
      <select id="xp-type">
      <option value="individual">individual</option>
      <option value="shared">shared</option>
      </select>
    </div>
    <div class="form-group">
      <label>Amount</label>
      <input type="text" inputmode="numeric" pattern="\d*" id="xp-amount">
    </div>
    </form>
    `,
  buttons: {
    one: {
      icon: '<i class="fas fa-check"></i>',
      label: "Confirm",
      callback: (html) =>
      {
        let type = html.find('[id=xp-type]')[0].value;
        let amount = parseInt(html.find('[id=xp-amount]')[0].value);
        award_xp(type, amount);
      }
    },
    two: {
      icon: '<i class="fas fa-times"></i>',
      label: "Cancel",
    }
  },
  default: "Cancel"
}).render(true);
