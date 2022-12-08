//Create a roll term with flavor text and execute the roll. Wait for the result and make the roll async.
// Note: Instead of "evaluate" --> "roll" can be used they seem identical 
let dies = await new Roll("1d20[black]+1d20[red]+1d20[yellow]").evaluate({async: true});

// Create a html based Chat message which will be outputed.
let ChatData={
// let the roll take part as a roll of the actor. If speaker ist deleted then the roll takes place as the player.
speaker: ChatMessage.getSpeaker({token: actor}),
// This was asked for by the Dice so Nice API. Currently not clear what it exactly does
type: CONST.CHAT_MESSAGE_TYPES.ROLL,
// Rolls a pool of dice/diceterms. If more than one diceterm/dices are rolled then an array of objects needs to be defined --> [r1,r2,r3]
rolls: [dies],
// This was asked for by the Dice so Nice API. Currently not clear what it exactly does
rollMode: game.settings.get("core", "rollMode"),
// Create HTML template for Chat message output. Each Dice in the dice term is an object in an array thus we need to adress it with dies.dice[x]. Remember: arrays start with an index of 0 in java script
content:`
<div class="dice-roll">
  <div class="dice-result">
   <div class="dice-tooltip" style="display: block;">
    <section class="tooltip-part">
        <div class="dice">
              <ol class="dice-rolls">
                <li class="roll die d20" style="transform: scale(1.1);margin-right: 4px">${dies.dice[0].results[0].result}</li>
                <li class="roll die d20 min" style="transform: scale(1.1);margin-right: 4px">${dies.dice[1].results[0].result}</li>
                <li class="roll d20" style="transform: scale(1.1);margin-right: 4px; color: yellow; filter: sepia(0.5) saturate(6)contrast(0.8) brightness(1.1)">${dies.dice[2].results[0].result}</li>
            </ol>

        </div>
    </section>
  </div>
     <h4 class="dice-total">${dies.dice[0].results[0].result} / ${dies.dice[1].results[0].result} / ${dies.dice[2].results[0].result} </h4>
 </div>
</div> `
}
// Create the Chat message
ChatMessage.create(ChatData);
