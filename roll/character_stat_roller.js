/**
 * Generates character stats and outputs the table result.
 * Author: @Kekilla#7036 & KrishMero1792
 */
 
// Formula for rolling 
const statString = '4d6kh3';

// times to roll those stats
const numRolls = 6;


//////////////////////////////////////////
// Don't touch anything below this line //
//////////////////////////////////////////
const stats = Array(numRolls).fill(0).map(e=>new Roll(statString).evaluate({async: false}));

const rollData = stats[0].dice[0];
const {faces, values: keptRolls, results: rolls} = rollData;
const totalAverage = (faces/2 + 1) * keptRolls.length;
const totalDeviation = faces/2;
const totalLow = Math.ceil(totalAverage - totalDeviation);
const totalHigh = Math.ceil(totalAverage + totalDeviation);

const header = rolls.map((roll, index) => `<th>D${index + 1}</th>`).join('');

let tableRows = '';
let finalSum = 0;
for(let {terms, total} of stats) {
  tableRows += `<tr style="text-align:center">`;
  tableRows += terms[0].results.map(({result, discarded}) => `<td style="${colorSetter(result, 1, faces, discarded)}">${result}</td>`).join('');
  tableRows += `<td style="border-left:1px solid #000; ${colorSetter(total, totalLow, totalHigh)}">${total}</td></tr>`;
  finalSum += total;
}

const colspan = `colspan="${rolls.length + 1}"`;
const center = `text-align:center;`;

let content = `
  <table>
    <tr>
      <td ${colspan}><h2 style="margin-bottom:0; ${center}">New Ability Scores</h2>
      <div style="margin-bottom: 0.5rem; ${center}">${statString} was rolled ${numRolls} times.</div></td>
    </tr>
    <tr style="${center} border-bottom:1px solid #000">
      ${header}
      <th style="border-left:1px solid #000">Total</th>
    </tr>
    ${tableRows}
    <tr style="border-top: 1px solid #000">
      <th colspan="${rolls.length}" style="${center}">Final Sum:</th>
      <th style="${center}">${finalSum}</th>
    </tr>
  </table>
`;


ChatMessage.create({content});

function colorSetter(number,low,high, discarded)
{
  if(discarded === true) return 'text-decoration:line-through;color:gray';
  if(number <= low) return 'color:red';
  if(number >= high) return 'color:green';
  return '';
}
