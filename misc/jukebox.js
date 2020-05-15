/**
 * Quickly play from a list of sound effects and set their audio level. (does not loop)
 * Author: Rockshow
 */

let playlist = {
  'twigs breaking': 'audio/twigs_1.mp3',
  'door opening': 'sounds/lock.wav',
};

let optionList;
for (let [key, value] of Object.entries(playlist)) {
  optionList += `<option value="${value}">${key}</option>`;
}

let applyChanges = false;
new Dialog({
  title: `Audio chosing form`,
  content: `
    <form>
      <div class="form-group">
        <label>Canzone:</label>
        <select id="idcanzone" name="idcanzone">
          ${optionList}
        </select>
      </div>
   
        <div class="form-group">
        <label for="vol">Volume:</label>
           <div class="form-fields">
            <input type="range" id="vol" name="vol" min="0" max="8" value="1" step="0.2" data-dtype="Number">
            <span class="range-value" id="demo">1</span>
           </div>
        </div>
 </form> 
<script>
var slider = document.getElementById("vol");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}
</script>
          `,
  buttons: {
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel Changes`
        },
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Changes`,
      callback: () => applyChanges = true
         },
           },
  default: "yes",
  close: html => {
    if (applyChanges) {
    let canzone= html.find('[name="idcanzone"]')[0].value || "none";
    let vol1= html.find('[name="vol"]')[0].value || "none";
    AudioHelper.play({src: canzone, volume:vol1, autoplay: true, loop: false}, true);
                      }
                 }
  }).render(true);
