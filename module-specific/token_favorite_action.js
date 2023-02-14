/*
* FAVORITE ACTION PICKER
* Requires: DND5e with Tidy5eSheet extension
* --------------------------------------------------------------------------------
* Provides handy and minimalistic, icon based menu for accessing actions that checked
* in as favorite for a selected token or main character.
* --------------------------------------------------------------------------------
* Author: Broadway-afk
* This script forked from show_token_actions.js macro made by shawndibble and stick#0520
*/

class ActionDialog extends Application {
  getData(){
    // Get user's character or the first token from the controlled list.
    function getTargetActor() {
      const character = game.user.character;
      if (character)
        return character;

      const controlled = canvas.tokens.controlled;

      if (controlled.length > 0 && controlled[0] !== null)
        return controlled[0].actor;
    }

    function buildActionsList(targetActor) {
      let actionsList = [];
      Object.entries(targetActor.itemTypes).forEach(([type, items]) => {
        items.forEach(item => {
          if (item.flags["tidy5e-sheet"]?.favorite) {
            actionsList.push(item);
          }
        });
      })
      return actionsList;
    }

    function getContentTemplate(actions) {
      let actionButtonsTemplate = actions.map((action) => {
        let displayName = action.name.split(" /")[0];
        let initials = displayName.split(" ").map((item) => item[0]).join("").toUpperCase();
        return `<button title="${displayName}" onclick="${getRollItemMacro(action.name)}"> 
                  <figure>
                    <img alt="${action.name}" src="${action.img}" /> 
                    <figcaption>${initials}</figcaption> 
                  </figure> 
                </button>`
      }).join(" ");

      return `
                ${getCssStyle()}
                <div class="favorite-actions">
                  ${actionButtonsTemplate}
                </div>
              `;
    }

    function getCssStyle() {
      return `<style>
                .favorite-actions {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                }
                .favorite-actions button {
                  width: 40px;
                  padding: 0;
                }
                .favorite-actions figure {
                  margin: 0;
                  position: relative;
                }    
                .favorite-actions figcaption {
                  padding: 0;
                  line-height: 1;
                  margin-top: 0;
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 25px;
                  color: white;
                  opacity: 0.5;
                  text-shadow: 0 0 6px #000000;
                }           
              </style>`
    }

    function getRollItemMacro(itemName) {
      return `game.dnd5e.rollItemMacro(&quot;${itemName}&quot;)`;
    }

    let targetActor = getTargetActor();
    let innerContent = "";

    if (targetActor) {
      this.options.title = `${targetActor.name} favorite actions`;
      let actionLists = buildActionsList(targetActor);
      innerContent = getContentTemplate(actionLists);
    } else {
      ui.notifications.error("No token selected or user character found.");
      throw new Error("No token selected or character found");
    }

    let content =  `<div id="actionDialog">${innerContent}</div>`;
    let contentsObject = {content:`${content}`}
    return contentsObject;
  }
}

let opt=Dialog.defaultOptions;
opt.resizable=true;
opt.minimizable=true;
opt.width=600;
let viewer;
viewer = new ActionDialog(opt);
viewer.render(true);
