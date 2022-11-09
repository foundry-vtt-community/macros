/* global Roll, character, ui, ChatMessage, Dialog */
/*
A potion has a creation cost specified in the table below.
A character engaged in the crafting of a magic item makes progress in 25 gp increments, spending that amount for each day of work until the total cost is paid.
The character is assumed to work for 8 hours each of those days.
Item Rarity Creation Cost   Minimum Level
Common      50 gp           3rd
Uncommon    250 gp          3rd
Rare        1,500 gp        6th
Very rare   5,000 gp        11th
Legendary   25,000 gp       17th
*/
// Things to consider
// - Complications should be rolled every day???
const debug = false;
const content = `
        <form>
            <div class="form-group">
            <label id="days">Days</label>
            <input id="days-amount" type="number" name="inputField" autofocus>
            </div>
        </form>`;
function applywork (html) {
  // Yoink the input field
  const result = html.find('input[name=\'inputField\']');
  // Make sure the result is not empty
  let days = 0;
  if (result.val() !== '') {
    days = result.val();
  }
  main(days);
}
new Dialog({
  title: 'Enter number of days',
  content,
  buttons: {
    apply: {
      // Shove the resulting html into the function
      callback: (html) => applywork(html),
      icon: '<i class="fa-thin fa-timer"></i>',
      label: 'Downtime!'
    }
  }
}).render(true);

async function main (days) {
  // This is a JavaScript comment
  // Check to see if active character. If not, chat error
  if (character == null) {
    ui.notifications.error('You have no selected character');
    return;
  }
  // Do this to yoink all the possible rolls for a character
  const actor = character.getRollData();
  // Don't know if I need to do this tbh
  const arcmod = actor.skills.arc.total;
  // See if user has proficiency with Alchemist's supplies
  const hasprof = character.items.filter(item => item.name.match(/^Alchemist.s Supplies$/) && Object.prototype.hasOwnProperty.call(item.system, 'proficient'));
  let rollmethod = '';
  // Roll normally if not, and advantage if so
  if (hasprof.length === 0) {
    rollmethod = `1d20+${arcmod}`;
  } else {
    rollmethod = `2d20kh1+${arcmod}`;
  }
  let totalprogress = 0;
  let basemultiplier = 1;
  // Check for arcana proficiency
  if (actor.skills.arc.prof.multiplier === 2) {
    basemultiplier = 1.5;
  } else if (actor.skills.arc.prof.multiplier === 1) {
    basemultiplier = 1.25;
  } else if (actor.skills.arc.prof.multiplier === 0.5) {
    basemultiplier = 1.1;
  }
  for (let iter = 0; iter < days; iter++) {
    const arcanerolleval = await new Roll(rollmethod).evaluate({ async: true });
    // Reset the work and multiplier per iter
    let multiplier = basemultiplier;
    let work = 0;
    // Find the rolled number, maybe a better way of doing this
    const regex = /^\d+/;
    const temp = arcanerolleval.result.match(regex);
    const natural = Number(temp[0]);
    if (arcanerolleval.total <= 5) {
      work = 0;
    } else if (arcanerolleval.total >= 6 && arcanerolleval.total <= 10) {
      work = 25;
    } else if (arcanerolleval.total >= 11 && arcanerolleval.total <= 15) {
      work = 35;
    } else if (arcanerolleval.total >= 16 && arcanerolleval.total <= 20) {
      work = 45;
    } else if (arcanerolleval.total >= 21 && arcanerolleval.total <= 25) {
      work = 60;
    } else if (arcanerolleval.total >= 26 && arcanerolleval.total <= 30) {
      work = 100;
    } else if (arcanerolleval.total >= 31) {
      work = 200;
    }
    // Check for nat 1 or nat 20
    if (natural === 20) {
      multiplier = multiplier * 2;
    } else if (natural === 1) {
      multiplier = multiplier * 0.5;
    }
    totalprogress += Math.floor(work * multiplier);
  }
  // Send the chat message
  const chatMsg = `
    <p>Days spent working: ${days}</p>
    <p>Total progress gained: ${totalprogress}gp</p>
    `;
  // Send relevant messages
  ChatMessage.create({ content: chatMsg, speaker: ChatMessage.getSpeaker() });
  // Check to see if a complication arises and output a message if so
  const complicationroll = await new Roll('1d100').evaluate({ async: true });
  if (complicationroll.total <= 10) {
    ChatMessage.create({ content: 'Complication!', speaker: ChatMessage.getSpeaker() });
  }
  // Just debug stuff
  if (debug === true) {
    console.log('Basemultiplier: ' + basemultiplier);
    console.log('Days: ' + days);
    console.log(character);
    console.log(actor);
    console.log('Arcane mod: ' + arcmod);
    if (hasprof.length === 0) {
      console.log('No tools and/or prof');
    } else {
      console.log('Has tools and prof');
    }
    console.log('Roll method: ' + rollmethod);
    console.log('Complication roll: ' + complicationroll.result);
  }
}
