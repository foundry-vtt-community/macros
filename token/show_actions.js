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
        const buttons = html.find("button[class='show-action-tablink']");
        
        if (buttons.length > 0)
            buttons.on("click", event => {this.openActionTab(event, html);});
    }   
      
    openActionTab(event, html) {
        // Declare all variables
        var i, tabcontent, tablinks;
      
        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("show-action-tabcontent");
        for (let t of tabcontent) {
          t.style.display = "none";
        }
      
        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("show-action-tablink");
        for (let t of tablinks) {
          t.className = t.className.replace(" active", "");
        }
      
        // Show the current tab, and add an "active" class to the button that opened the tab
        if (event.target.value == "actionAll") {
            tabcontent = document.getElementsByClassName("show-action-tabcontent");
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

        function getActionLists(targetActor) {
            let equipment = targetActor.data.items.filter(i => i.type !="consumable" && i.data.equipped);
            let spells = targetActor.data.items.filter(i => i.type == "spell" && i.data.preparation.prepared);
            let feats = targetActor.data.items.filter(i => i.type == "feat");
            let consumables = targetActor.data.items.filter(i => i.type == "consumable");

            return {"equipment": equipment,"spells": spells, "feats": feats,"consumables": consumables};
        }

        function getContentTemplate(actionLists) {
            let template = `
            <div>
                 ${getCssStyle()}
                <div class="show-action-form-group">
                    <div class="show-action-tabs">
                        <button value="actionEquipment" class="show-action-tablink">Equipment</button>
                        <button value="actionSpells" class="show-action-tablink">Spells</button>
                        <button value="actionFeats" class="show-action-tablink">Feats</button>
                        <button value="actionConsumables" class="show-action-tablink">Consumables</button>
                        <button value="actionAll" class="show-action-tablink">Show all</button>
                    </div>
                    </div>
                    <div class="show-action-actions">
                        ${getEquipmentTemplate(actionLists["equipment"])}
                        ${getSpellsTemplate(actionLists["spells"])}
                        ${getFeatsTemplate(actionLists["feats"])}
                        ${getConsumablesTemplate(actionLists["consumables"])}
                    </div>
                </div>
            </div>`;
            
            return template;
        }

                // Gets a template of abilities or skills, based on the type of check chosen.
        function getEquipmentTemplate(equipment) {
            if (equipment.length == 0)
                return "";
            
            let equipped = getActiveEquipment(equipment);
            let template = getCategorisedEquipmentTemplate(
                    equipped.filter(i => i.type == "weapon"),
                    equipped.filter(i => i.type == "equipment"),
                    equipped.filter(i => i.type != "weapon" && i.type != "equipment")
                    );

            return template;
        }

        function getActiveEquipment(equipment) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);

            let activeEquipment = equipment.filter(e => {
                for (let [key, value] of activationTypes) {
                    if (e.data.activation.type == key)
                        return true;
                }
                
                return false;
            });

            return activeEquipment;
        }

        // Gets a template of abilities or skills, based on the type of check chosen.
        function getCategorisedEquipmentTemplate(weapons, armor, other) {
            let template = `<div id="actionEquipment" class="show-action-tabcontent">
                                <label>Equipment:</label>`

            if (weapons.length > 0) {
                template += `<label>Weapons</label>`;
                for (let w of weapons) {
                    template += `<input id="weapon-${w.name}" type="button" value="${w.name}" onclick="${getRollItemMacro(w.name)}"/>`;    
                }          
            }

            if (armor.length > 0) {
                template += `<label>Equipment</label>`;
                for (let a of armor) {
                    template += `<input id="armor-${a.name}" type="button" value="${a.name}" onclick="${getRollItemMacro(a.name)}"/>`;    
                }          
            }

            if (other.length > 0) {
                template += `<label>Other</label>`;
                for (let o of other) {
                    template += `<input id="equipment-other-${o.name}" type="button" value="${o.name}" onclick="${getRollItemMacro(o.name)}"/>`;    
                }          
            }  
            
            template += `</div>`;

            return template;
        }

        // Gets a template of abilities or skills, based on the type of check chosen.
        function getSpellsTemplate(spells) {
            if (spells.length == 0)
                return "";
                
            let template = `<div id="actionSpells" class="show-action-tabcontent">
                <label>Spells:</label>`;  

            let magic = getSpellbookAndPowers(spells);
            console.log(magic);

            let powers = Object.entries(magic["powers"]);
            if (powers.length > 0) {
                for (let [name, entries] of powers) {
                    template += `<div>`;
                    
                    template += `<label>${name}</label>`;
         
                    for (let p of entries) {
                        template += `<input id="spell-${p.name}" type="button" value="${p.name}" onclick="${getRollItemMacro(p.name)}"/>`;    
                    }
        
                    template += `</div>`
                }
            }
                
            let spellbook = Object.entries(magic["book"]);
            console.log(spellbook);
            if (spellbook.length > 0) {
                for (let [level, entries] of spellbook) {
                    template += `<div>`;

                    if (level == 0) {
                        template += `<label>Cantrips</label>`
                    } else {
                        template += `<label>Level ${level}</label>`
                    }

                    for (let s of entries) {
                        template += `<input id="spell-${s.name}" type="button" value="${s.name}" onclick="${getRollItemMacro(s.name)}"/>`;    
                    }
    
                    template += `</div>`
                }   
            }
            
            template += `</div>`;

            return template;
        }

        function getSpellbookAndPowers(spells) {
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
            
            return {"book": book, "powers": powers};
        }

        function getActiveFeats(feats) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);
            let activeFeats = feats.filter(f => {
                for (let [key, value] of activationTypes) {
                    if (f.data.activation.type == key)
                        return true;
                }
                
                return false;
            });

            return activeFeats;
        }

        function getPassiveFeats(feats) {
            const activationTypes = Object.entries(game.dnd5e.config.abilityActivationTypes);
            let passiveFeats = feats.filter(f => {
                for (let [key, value] of activationTypes) {
                    if (f.data.activation.type == key)
                        return false;
                }
                
                return true;
            });

            return passiveFeats;
        }

        function getFeatsTemplate(feats) {
            if (feats.length == 0)
                return "";

            let activeFeats = getActiveFeats(feats);
            let passiveFeats =  getPassiveFeats(feats);

            let template = `<div id="actionFeats" class="show-action-tabcontent">
                                <label>Feats</label>`

            if (activeFeats.length > 0) {
                template += `<div><label>Active</label>`
                for (let f of activeFeats) {
                    template += `<input id="feat-${f.name}" type="button" value="${f.name}" onclick="${getRollItemMacro(f.name)}"/>`;    
                }
                template += `</div>`
            }

            if (passiveFeats.length > 0) {
                template += `<div><label>Passive: </label>`
                for (let f of passiveFeats) {
                    template += `<input id="feat-${f.name}" type="button" value="${f.name}" onclick="${getRollItemMacro(f.name)}"/>`;    
                }
                template += `</div>`
            }
            
            template += `</div>`;

            return template;
        }

        function getConsumablesTemplate(consumables) {          
            if (consumables.length == 0)
                return "";

            let template = `<div id="actionConsumables" class="show-action-tabcontent">
                <label>Consumables:</label>`

            for (let c of consumables) {
                template += `<input id="consumable-${c.name}" type="button" value="${c.name}" onclick="${getRollItemMacro(c.name)}')"/>`;    
            }            
            
            template += `</div>`;

            return template;
        }

        function getCssStyle() {
            return `
            <style type="text/css">
            .show-action-tabs button {
                width: auto;
                background-color: inherit;
                float: left;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 14px 16px;
                transition: 0.3s;
                display: block;
              }
                            
              /* Change background color of buttons on hover */
              .show-action-tabs button:hover {
                background-color: #ddd;
              }
              
              /* Create an active/current tablink class */
              .show-action-tabs button.active {
                background-color: #ccc;
              }

              .show-action-actions {
                clear: both;
              }
              
              /* Style the tab content */
              .show-action-tabcontent {
                display: block;
                padding: 6px 12px;
                border: 1px solid #ccc;
                border-top: none;
              }
              
              .show-action-tabcontent label {
                padding: 6px 12px;
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
            let actionLists = getActionLists(targetActor);
            innerContent = getContentTemplate(actionLists);
        } else { throw new Error("No token selected or character found"); }
        
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
