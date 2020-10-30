/*
* Requires: DND5e.
* Provides a dialog showing all action-triggered equipment, prepared and at-will spells, feats, and consumables,
* as well as passive feats. Hopefully makes triggering actions easier without needing the character sheet open
* all the time.
* WARNING: Very ugly.
* author/blame: ^ and stick#0520
* with enormous help on the button events (and no blame to be attributed to): Skimble#8601
*/

class ActionDialog extends Application {
    super(options){
    }

    activateListeners(html) {
        super.activateListeners(html);
        const buttons = html.find("button[class='show-action-button']");
        
        if (buttons.length > 0)
            buttons.on("click", event => {this.openActionTab(event, html);});
    }   
      
    openActionTab(event, html) {
        // Declare all variables
        var i, tabcontent, tablinks;
      
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("show-action-category");
        for (let t of tabcontent) {
          t.style.display = "none";
        }
      
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("show-action-button");
        for (let t of tablinks) {
          t.className = t.className.replace(" active", "");
        }
      
        // Show the current tab, and add an "active" class to the button that opened the tab
        if (event.target.value == "showActionAll") {
            tabcontent = document.getElementsByClassName("show-action-category");
            for (let t of tabcontent) {
                t.style.display= "block";
            }
        } else {
            if (document.getElementById(event.target.value) != null)
                document.getElementById(event.target.value).style.display = "block";
        }
        event.currentTarget.className += " active";
    } 

    getData(){
        // Get user's character or the first token from the controlled list.
        function getTargetActor() {
            const character = game.user.character;
            if (character != null)
                return character;

            const controlled = canvas.tokens.controlled;

            if (controlled.length === 0) return character || null;

            if (controlled.length > 0 && controlled[0] != null) {
                return controlled[0].actor;
            }
        }

        function buildActionsList(targetActor) {
            let equipped = targetActor.data.items.filter(i => i.type !="consumable" && i.data.equipped);
            let activeEquipped = getActiveEquipment(equipped);
            let weapons = activeEquipped.filter(i => i.type == "weapon");
            let equipment = activeEquipped.filter(i => i.type == "equipment");

            let other = activeEquipped.filter(i => i.type != "weapon" && i.type != "equipment");
            let consumables = targetActor.data.items.filter(i => i.type == "consumable");
            let items = { "weapons": weapons, "equipment": equipment, "other": other, "consumables": consumables };

            let preparedSpells = targetActor.data.items.filter(i => i.type == "spell" && i.data.preparation.prepared);
            let spells = categoriseSpells(preparedSpells);

            let allFeats = targetActor.data.items.filter(i => i.type == "feat");
            let activeFeats = getActiveFeats(allFeats);
            let passiveFeats =  getPassiveFeats(allFeats);
            let feats = {"active": activeFeats, "passive": passiveFeats};
            

            return { "equipment": items,"spells": spells, "feats": feats };
        }

        function getActiveEquipment(equipment) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);

            let activeEquipment = equipment.filter(e => {
                if (e.data.activation == undefined)
                    return false;

                for (let [key, value] of activationTypes) {
                    if (e.data.activation.type == key)
                        return true;
                }
                
                return false;
            });

            return activeEquipment;
        }

        function categoriseSpells(spells) {
            let powers = {};
            let book = {}

            book = spells.reduce(function (book, spell) {
                var level = spell.data.level;
                let prep = spell.data.preparation.mode;

                const prepTypes = game.dnd5e.config.spellPreparationModes;
                let prepType = prepTypes[prep];

                if (prep == "pact" || prep == "atwill" || prep == "innate") {
                    if (!powers.hasOwnProperty(prepType)) {
                        powers[prepTypes[prep]] = [];
                    }

                    powers[prepType].push(spell);
                } else {
                    if (!book.hasOwnProperty(level)) {
                        book[level] = [];
                    }

                    book[level].push(spell);
                }

                return book;
            }, {});
            
            return {"book": Object.entries(book), "powers": Object.entries(powers)};
        }

        function getActiveFeats(feats) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);
            let activeFeats = feats.filter(f => {
                if (f.data.activation == undefined)
                    return false;

                for (let [key, value] of activationTypes) {
                    if (f.data.activation.type == key)
                        return true;
                }
                
                return false;
            });

            return Object.entries(activeFeats);
        }

        function getPassiveFeats(feats) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);
            let passiveFeats = feats.filter(f => {
                if (f.data.activation == undefined)
                    return false;

                for (let [key, value] of activationTypes) {
                    if (f.data.activation.type == key)
                        return false;
                }
                
                return true;
            });

            return Object.entries(passiveFeats);
        }

        function getContentTemplate(actions) {
            let template = `
            <div>
                 ${getCssStyle()}
                <div class="show-action-form-group">
                    <div class="show-action-buttons">
                        <button value="showActionItems" class="show-action-button">Items</button>
                        <button value="showActionSpells" class="show-action-button">Spells</button>
                        <button value="showActionFeats" class="show-action-button">Feats</button>
                        <button value="showActionAll" class="show-action-button">Show all</button>
                    </div>
                    </div>
                    <div class="show-action-categories">
                        <div id="showActionItems" class="show-action-category">
                            ${getItemsTemplate(actions.equipment)}
                        </div>
                        <div id="showActionSpells" class="show-action-category">
                            ${getSpellsTemplate(actions.spells)}
                        <div id="showActionFeats" class="show-action-category">
                            ${getFeatsTemplate(actions.feats)}
                        </div>
                    </div>
                </div>
            </div>`;
            
            return template;
        }

                // Gets a template of abilities or skills, based on the type of check chosen.
        function getItemsTemplate(items) {
            if (items.weapons.length + items.equipment.length + items.other.length + items.consumables.length === 0)
                return "";

            let template = `<div id="actionItems" class="show-action-tabcontent">
                                <div class="show-action-tabcontent-title">Items</div>
                                    ${getItemsCategoryTemplate("Weapons", items.weapons)}
                                    ${getItemsCategoryTemplate("Equipment", items.equipment)}
                                    ${getItemsCategoryTemplate("Other", items.other)}
                                    ${getItemsCategoryTemplate("Consumables", items.consumables)}
                                </div>
                            </div>`;

            return template;
        }

        function getSpellsTemplate(spells) {                
            let template = `<div id="actionSpells" class="show-action-tabcontent">
                                <div class="show-action-tabcontent-title">Spells</div>
                                    ${getSpellsCategoryTemplate(spells.powers)}
                                    ${getSpellsCategoryTemplate(spells.book)}
                                </div>
                            </div>`;

            return template;
        }
        
        function getFeatsTemplate(feats) {
            if (feats.active.length + feats.passive.length === 0)
                return "";

            let template = `<div id="actionFeats" class="show-action-tabcontent">
                                <div class="show-action-tabcontent-title">Feats</div>
                                    ${getFeatsCategoryTemplate("Active", feats.active)}
                                    ${getFeatsCategoryTemplate("Passive", feats.passive)}
                                </div>
                            </div>`;

            return template;
        }

        function getItemsCategoryTemplate(title, items) {
            if (items.length === 0)
                return "";

            let template = `<div class="show-action-tabcontent-subtitle">${title}</div>
                            <div class="show-action-tabcontent-actions">`;
            for (let i of items) {
                template += `<input id="weapon-${i.name}" type="button" value="${i.name}" onclick="${getRollItemMacro(i.name)}"/>`;    
            } 

            template += `</div>`;

            return template;
        }

        function getSpellsCategoryTemplate(spells) {
            if (spells.length === 0)
                return "";

            let template = "";

            for (let [level, entries] of spells) {
                console.log(isNumber(level.toString()));
                let subtitle = !isNumber(level) ? level : (level === 0 ? `Cantrips` : `Level ${level}`);

                template += `<div class="show-action-tabcontent-subtitle">${subtitle}</div>
                                <div class="show-action-tabcontent-actions">`;
        
                for (let s of entries) {
                    template += `<input id="spell-${s.name}" type="button" value="${s.name}" onclick="${getRollItemMacro(s.name)}"/>`;    
                }
    
                template += `</div>`;
            }
            
            return template;
        }

        function getFeatsCategoryTemplate(subtitle, feats) {
            if (feats.length === 0)
                return "";
            
            let template = `<div class="show-action-tabcontent-subtitle">${subtitle}</div>
                            <div class="show-action-tabcontent-actions">`
                            
            for (let [index, f] of feats) {
                template += `<input id="feat-${f.name}" type="button" value="${f.name}" onclick="${getRollItemMacro(f.name)}"/>`;    
            }

            template += `</div>`
            

            return template;
        }

        function getCssStyle() {
            return `
            <style type="text/css">
            .show-action-buttons {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                grid-gap: 10px;
            }

            .show-action-buttons button {
                width: auto;
                height: auto;
                background-color: #eee;
                float: left;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 5px 8px;
                transition: 0.3s;
                display: block;
              }
                            
              /* Change background color of buttons on hover */
              .show-action-buttons button:hover {
                background-color: #ddd;
              }
              
              /* Create an active/current tablink class */
              .show-action-buttons button.active {
                background-color: #ccc;
              }

              .show-action-categories {
                clear: both;
              }
              
              /* Style the tab content */
              .show-action-tabcontent {
                display: block;
                padding: 6px 12px;
                border: 1px solid #ccc;
                border-bottom: none;
                border-left: none;
                border-right: none;
              }

              .show-action-tabcontent-title {
                    clear: both;
                    font-size: large;
              }

              .show-action-tabcontent-subtitle {
                  padding: 5px;
                  margin: 2px;
                  float: left;
              }

              .show-action-tabcontent input {
                border: 1px solid #555;
                padding: 5px;
                margin: 2px;
              }
              
              .show-action-tabcontent input:hover {
              background-color: #ddd;
              }
            </style>`
        }

        function getRollItemMacro(itemName) {
            return `game.dnd5e.rollItemMacro(&quot;${itemName}&quot;)`;
        }

        // set this to true if you want results whispered to the GM
        let targetActor = getTargetActor();
        let innerContent = "";

        if (targetActor != null || targetActor) {
            this.options.title = `${targetActor.name} actions`;
            let actionLists = buildActionsList(targetActor);
            innerContent = getContentTemplate(actionLists);
        } else {
            ui.notifications.error("No token selected or user character found.");
            throw new Error("No token selected or character found");
        }
        
        var content =  `<div id="actionDialog">${innerContent}</div>`;
        var contentsObject = {content:`${content}`}
        return contentsObject;
    }
}

let opt=Dialog.defaultOptions;
opt.resizable=true;
opt.title="Choose action";
opt.minimizable=true;
opt.width=600;
var viewer;
viewer = new ActionDialog(opt);
viewer.render(true);
