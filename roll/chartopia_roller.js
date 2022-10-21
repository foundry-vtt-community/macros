/**
 * Make a roll from chartopia and output the results in the chat window.
 * If you find yourself using this macro often, please support chartopia on patreon.
 */

// chart id from url. IE 19449 is the chart id in https://chartopia.d12dev.com/chart/19449/
const chartId = 61778;
// only let the gm see the results. false = everyone sees in chat. true = gm whispered results.
const gmOnly = false;


//////////////////////////////////
/// Don't edit past this point ///
//////////////////////////////////

const requestUrl = `https://chartopia.d12dev.com/api/charts/${chartId}/roll/`;


function roll(id) {
  let request = new XMLHttpRequest();
  request.open('POST', requestUrl, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      let whisper = !!gmOnly ? game.users.map(u => {
          if (u.isGM) return u.id;
      }) : [];
      console.log('whisper', whisper);
      // Create chat content.
      const response = JSON.parse(request.response);
      let resultsList = ``;
      if (Array.isArray(response.results)) {
        response.results.forEach(result => {
            result = result.replace("**", "<strong>");
            result = result.replace("**", "</strong>");
            resultsList += `<li>${result}</li>`;
        });
      } 
      console.log(resultsList);
      
      let chatContent = `<h4><strong>Chart</strong></br> ${response.chart_name}(${response.chart_id})</h4>` +
                        `<h4><strong>URL</strong></br> ${response.chart_url}</h4>` +
                        `<h4><strong>Results</strong></h4>` +
                        `<ul id="results-list">${resultsList}</ul>`;
      let chatData = {
        user: game.userId,
        speaker: ChatMessage.getSpeaker(),
        content: chatContent,
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
