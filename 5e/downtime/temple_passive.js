/* global Roll, character, ui, ChatMessage, Dialog */
/*
A macro for working out the passive income for a temple.
Things to add:
 - Use character variables to store temple stats
 - Consider a popularity value above 100%
 - Income possibility for spare beds, or not??????
  - Likely would impact other aspects due to laws n shit
*/
// Total livible rooms
const totalRoomNumber = 8;
// Total food and board workers
const slaveLabour = 6;
// Number of free rooms
const freeRoomNumber = totalRoomNumber - slaveLabour;
// Total wage workers
const wageLabour = 0;
// Cost of F&B workers per day in gp
const slavePay = 0.2;
// Cost of wage worker per day in gp
const wagePay = 1;
// Number of sermons per week
const weeklySermons = 1;
// Skill of sermon person
let sermonSkill = 1;
// Total available seating for a sermon
const totalSeating = 20;
const maxSermonBase = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(+totalSeating * 20);
const minSermonBase = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(+totalSeating * 0.2);
// Local popularity of religion, between 0 and 1
let localPopularity = 0.1;
// Wealth of local area, between 0 and 1
const localWealth = 0.2;
// Defines the maximum popularity swing for a sermon
const maxSwing = 0.05;
// Send debug console logs
const debug = false;
const content = `
<form>
  <div class="form-group">
    <label id="days">Days</label>
    <input id="days-amount" type="number" name="days-field" autofocus>
  </div>
  <div class="form-group"> Player Sermon? 
    <input id="pc-sermon" type="checkbox" name="pc-field">
  </div>
  <h3>Workers</h3>
  <ul style="list-style-type:none;">
    <li>Free workers: ${slaveLabour} @ ${slavePay}gp per person, per day</li>
    <li>Paid workers: ${wageLabour} @ ${wagePay}gp per person, per day</li>
  </ul>
  <h3>Upkeep per day</h3>
  <ul style="list-style-type:none;">
    <li>Free workers: ${new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(+slaveLabour * +slavePay)}gp</li>
    <li>Paid workers: ${new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(+wageLabour * +wagePay)}gp</li>
    <li>General upkeep: 0.2gp</li>
  </ul>
  <h3>General stats</h3>
  <ul style="list-style-type:none;">
    <li>Total seating: ${totalSeating}</li>
    <li>Sermons per week: ${weeklySermons}</li>
    <li>Local popularity: ${new Intl.NumberFormat('default', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(localPopularity)}</li>
    <li>Local wealth: ${new Intl.NumberFormat('default', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(localWealth)}</li>
  </ul>
</form>
`;
function grabinput (html) {
  // Yoink the input field
  const daysResult = html.find('input[name="days-field"]');
  const sermonResult = html.find('input[name="pc-field"]:checked');
  // Make sure the result is not empty
  let days = 0;
  if (daysResult.val() !== '') {
    days = daysResult.val();
  }
  let pcSermon = false;
  if (sermonResult.val() === 'on') {
    pcSermon = true;
  }
  main(days, pcSermon);
}
new Dialog({
  title: 'Enter number of days',
  content,
  buttons: {
    apply: {
      // Shove the resulting html into the function
      callback: (html) => grabinput(html),
      icon: '<i class="fa-thin fa-timer"></i>',
      label: 'Downtime!',
      padding: '15px 32px',
      margin: '4px 2px'
    }
  }
}).render(true);

async function main (days, pcSermon) {
  if (character == null) {
    ui.notifications.error('You have no selected character');
    return;
  } else if (totalRoomNumber < slaveLabour) {
    console.log('Not enough room for slaves!');
    return;
  }
  const playercharacter = character.getRollData();
  const relmod = playercharacter.skills.rel.total;
  const permod = playercharacter.skills.per.total;
  // Work out the wage costs
  const totalSlavePay = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(+slaveLabour * +slavePay * +days);
  const totalWagePay = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(+wageLabour * +wagePay * +days);
  // Work out the number of sermons that will be performed
  const totalSermonPerformed = Math.floor((days / 7) * weeklySermons);
  // Work out the income and affect of any sermons
  let totalSermonIncome = 0;
  if (totalSermonPerformed > 0) {
    for (let iter = 0; iter < totalSermonPerformed; iter++) {
      // Define a minimum income for a sermon
      const minimumSermonIncome = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(+minSermonBase * +localPopularity * +localWealth);
      // Define the roll for the maximum sermon income
      const maximumSermonIncome = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(+maxSermonBase * +localPopularity * +localWealth);
      if (pcSermon === true) {
        const religiousroll = await new Roll(`1d20+${relmod}`).evaluate({ async: true });
        const persuasionroll = await new Roll(`1d20+${permod}`).evaluate({ async: true });
        const rollAverage = (religiousroll.total + persuasionroll.total) / 2;
        if (rollAverage < 5) {
          sermonSkill = 1;
        } else if (rollAverage >= 5 && rollAverage < 15) {
          sermonSkill = 2;
        } else if (rollAverage >= 15 && rollAverage < 25) {
          sermonSkill = 3;
        } else if (rollAverage >= 25) {
          sermonSkill = 4;
        }
      }
      const incomeRoll = await new Roll(`${sermonSkill}d${maximumSermonIncome}kh+${minimumSermonIncome}`).evaluate({ async: true });
      totalSermonIncome += incomeRoll.total;
      // Above the average will have a positive effect on popularity
      if ((incomeRoll.total - minimumSermonIncome) >= (maximumSermonIncome / 2)) {
        localPopularity = (((incomeRoll.total - minimumSermonIncome) / maximumSermonIncome) * maxSwing) + localPopularity;
      // Below the average will have a negative effect on popularity
      } else if (((incomeRoll.total - minimumSermonIncome) < (maximumSermonIncome / 2))) {
        localPopularity = localPopularity - (((incomeRoll.total - minimumSermonIncome) / maximumSermonIncome) * maxSwing);
      }
    }
  }
  const totalIncome = new Intl.NumberFormat('default', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(+totalSermonIncome - (+totalSlavePay + +totalWagePay));
  const newPopularity = new Intl.NumberFormat('default', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(localPopularity);
  const chatMsg = `
    <p>Days: ${days}</p>
    <p>Total income: ${totalIncome}gp</p>
    <p>New popularity: ${newPopularity}</p>
    `;
  // Send the chat message
  ChatMessage.create({ content: chatMsg, speaker: ChatMessage.getSpeaker() });

  if (debug === true) {
    console.log('Character' + character);
    console.log('Days: ' + days);
    console.log('Total number of rooms: ' + totalRoomNumber);
    console.log('Empty rooms: ' + freeRoomNumber);
    console.log('Total free workers: ' + slaveLabour);
    console.log('Total paid workers: ' + wageLabour);
    console.log('Total free upkeep: ' + slavePay);
    console.log('Total paid upkeep: ' + wagePay);
    console.log('Sermons per week: ' + weeklySermons);
    console.log('Total seats for sermon: ' + totalSeating);
    console.log('Local popularity: ' + localPopularity);
    console.log('Local wealth: ' + localWealth);
    console.log('Total free worker pay: ' + totalSlavePay);
    console.log('Total paid worker pay: ' + totalWagePay);
    console.log('Number of sermons: ' + totalSermonPerformed);
    console.log('Sermon income: ' + totalSermonIncome);
  }
}
