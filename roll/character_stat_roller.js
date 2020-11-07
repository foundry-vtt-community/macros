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
const stats = Array(numRolls).fill(0).map(e=>new Roll(statString).roll());

const {faces, rolls} = stats[0].parts[0];
const totalAverage = (faces/2 + 0.5) * rolls.filter(i=> i?.discarded !== true).length;
const totalDeviation = faces/2;
const totalLow = Math.ceil(totalAverage - totalDeviation);
const totalHigh = Math.ceil(totalAverage + totalDeviation);

const header = rolls.map((roll, index) => `<th>D${index + 1}</th>`).join('');

let tableRows = '';
let finalSum = 0;
for(let {parts, total} of stats) {
  tableRows += `<tr style="text-align:center">`;
  tableRows += parts[0].rolls.map(({result}) => `<td ${colorSetter(result, 1, faces)}>${result}</td>`).join('');
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

function colorSetter(number,low,high)
{
  if(number <= low) return 'color:red';
  if(number >= high) return 'color:green';
  return '';
}
