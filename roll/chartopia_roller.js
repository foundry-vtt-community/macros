/**
 * Make a roll from chartopia and output the results in the chat window.
 * If you find yourself using this macro often, please support chartopia on patreon.
 */

// chart id from url. IE 19449 is the chart id in https://chartopia.d12dev.com/chart/19449/
let chartId = 19449;
// only let the gm see the results. false = everyone sees in chat. true = gm whispered results.
let gmOnly = false;


//////////////////////////////////
/// Don't edit past this point ///
//////////////////////////////////

var rootUrl = "https://chartopia.d12dev.com/test/";

function roll(id) {
  let request = new XMLHttpRequest();
  request.open('GET', rootUrl+'dice-roll-result?chart_id='+id, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let whisper = !!gmOnly ? game.users.entities.filter(u => u.isGM).map(u => u._id) : '';

      let chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: request.responseText,
        whisper
      };

      ChatMessage.create(chatData, {});
    } else {
      // We reached our target server, but it returned an error
      console.log("Server error.");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("Error getting result.");
  };

  request.send();
} 

roll(chartId);
