// this script attempts to heal X points of damage by repeatedly using charges of wands of cure light wounds

function hitTarget(target) {
  if (target > 250) {
    ui.notifications.warn(
      "Too much healing! No one needs that much healing! Max 250."
    );
    return;
  }
  let current = 0;
  let chargesUsed;

  const rolls = [];
  for (chargesUsed = 0; current < target; chargesUsed += 1) {
    const roll = new Roll("1d8 + 1");
    roll.roll();
    current += roll.total;
    rolls.push({ roll: roll.total - 1 });
  }

  const roll = new Roll(`${chargesUsed}d8 + ${chargesUsed}`);
  const msg = roll.toMessage(
    { flavor: `Casting <i>cure light wounds</i> ${chargesUsed} times` },
    { create: false }
  );

  const fakeRoll = {
    class: "Roll",
    formula: `${chargesUsed}d8 + ${chargesUsed}`,
    dice: [
      {
        class: "Die",
        faces: 8,
        rolls: rolls,
        formula: `${chargesUsed}d8`,
        options: {},
      },
    ],
    parts: ["_d0", "+", `${chargesUsed}`],
    result: `${current - chargesUsed} + ${chargesUsed}`,
    total: current,
  };

  msg.roll = JSON.stringify(fakeRoll);
  msg.content = String(current);

  const tokens = canvas.tokens.controlled;
  if (tokens.length !== 1) {
    ui.notifications.warn("Please select a token.");
    return;
  }
  const token = tokens[0];
  msg.speaker = {alias: token.actor.data.name}

  ChatMessage.create(msg);
}

new Dialog({
  title: "Cast until heal a set amount",
  content:
    "<p>Enter the amount you want to heal</p><center><input type='number' id='amountInput'></center><br>",
  buttons: {
    submit: {
      label: "Heal",
      icon: '<i class="fas fa-medkit"></i>',
      callback: () => {
        const healTarget = parseInt(
          eval(
            $("#amountInput")
              .val()
              .match(/[0-9]*/g)
          )
        );
        hitTarget(healTarget);
      },
    },
  },
}).render(true);
