/* 
 * Macro: GeekDad's Table Roller
 * Version: 2
 * Updated: 23-12-2021 by Freeze
 * Description: A nice friendly Better Tables compatible table roller that can draw mass quantities from tables much faster than the UI.
*/

function getTableNames() {
  let tables = [];
  game.tables.forEach(table => {
   tables.push({ key: table.id, name: table.name });
  });
 
  return tables;
 }
 
 async function rollOnTable(tableKey, numRolls, betterTableState) {
   let table = game.tables.get(tableKey);
   await table.reset();
   if (game.betterTables) {
    let tableType = table.getFlag("better-rolltables", "table-type");
    let originalAmount = table.data["loot-rolls-amount-input"];
    await table.update({"loot-rolls-amount-input": numRolls});
    switch (betterTableState) {
     case 1:
       await game.betterTables.generateLoot(table);
      break;
     case 2:
      await game.betterTables.addLootToSelectedToken(table);
      break;
     default:
      if (tableType === "loot") {
       await game.betterTables.generateChatLoot(table);
      } else {
       await game.betterTables.betterTableRoll(table);
      }
      break;
    }
    await table.update({"loot-rolls-amount-input": originalAmount});
   } else {
    table.drawMany(numRolls);
   }
 }
 
 let tables = getTableNames();
 
 let content = `<form><div style="display: inline-block; width: 100%; margin-bottom: 10px">
   <label for="output-tableKey" style="vertical-align: top; margin-right: 10px;">Table Name:</label>
 <br /><select name="output-tableKey" id="output-tableKey">`
 
 tables.forEach(table => {
  content += `<option value='${table.key}'>${table.name}</option>`;
 });
 
 content += `</select><br /><label for="output-numberRolls">Number of Rolls:</label><input name="output-numberRolls" value="1" /><br />`
 
 if (game.betterTables) {
  content += `<p>Better Tables Options</p>
  <input type="radio" name="output-addToActor" id="onlyToChat" value="onlyToChat" checked />
  <label for="onlyToChat">Just output to chat</label><br />
  <input type="radio" name="output-addToActor" id="tableActor" value="tableActor" />
  <label for="tableActor">Add To Table Actor</label><br />
  <input type="radio" name="output-addToActor" id="selectedToken" value="selectedToken" />
  <label for="selectedToken">Add To Selected Token</label><br /> 
 `
 }
 
 content += `</div><br /></form>`
 
  new Dialog({
   title: `GeekDad's Table Roller`,
   content: content,
   buttons: {
    yes: {
     icon: "<i class='fas fa-check'></i>",
     label: "Roll it",
     callback: (html) => {
      let tableKey = html.find("select[name='output-tableKey']").val();
      let numRolls = html.find("input[name='output-numberRolls']").val();
      let betterTableState = 0;
      if (html.find("input[name='output-addToActor']:checked").length > 0) {
       let radioVal = html.find("input[name='output-addToActor']:checked").val();
       betterTableState = radioVal == "onlyToChat" ? 0 : "tableActor" ? 1 : 2;
      }
      rollOnTable(tableKey, numRolls, betterTableState);
     }
    },
    no: {
     icon: "<i class='fas fa-times'></i>",
     label: 'Cancel'
    }
   },
   default: "yes"
  }).render(true);