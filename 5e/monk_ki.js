/**
 * Monk Ki Point spender
 * 
 * This macro will prompt which Feature you want to spend Ki points on.
 * 
 * Flurry of Blows: Automatically cast two Unarmed Strike's
 * Stunning Strike: Automatically show the saving throw DC
 * Deflect Missiles: Automatically show the damage reduction
 */
(async () => {
    const kiName = "Ki Points";
    const errNoMonkToken = "Please select a single monk token.";

    const sendChat = async (msg) => {
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            content: msg,
        };
        ChatMessage.create(chatData, {});
    }

    if (!actor) {
        ui.notifications.warn(errNoMonkToken);
        return
    }

    let monk = actor.items.find(i => i.name === 'Monk' && i.type === 'class');
    if (!monk) {
        ui.notifications.warn(errNoMonkToken);
        return
    }

    let monkLevels = monk.data.data.levels || 20;
    //let subClass = monk.data.data.subclass;

    if (monkLevels < 2) {
        ui.notifications.warn('You must have a least 2 Monk levels to use ki points.');
        return
    }

    class KiFeature {
        /**
         * @param {string} name
         * @param {string} fallbackText
         * @param {number} requireLevel
         * @param {function} action
         * @param {function} appendTemplate
         * @param {number} kiCost
         */
        constructor(name, fallbackText, requireLevel, action, appendTemplate, kiCost) {
            this.name = name;
            this.fallbackText = fallbackText;
            this.requireLevel = requireLevel;
            this.kiCost = kiCost || 1;
            if (action) {
                this.action = action;
            }
            if (appendTemplate) {
                this.appendTemplate = appendTemplate;
            }
        }

        render(allowHigher) {
            let entry = null;

            const pack = game.packs.get("dnd5e.classfeatures");
            if (!pack) {
                console.warn('Could not find "dnd5e.classfeatures" compendium.');
            } else {
                entry = pack.index.find(e => e.name === this.name);
            }

            if (!allowHigher && this.requireLevel && monkLevels && this.requireLevel > monkLevels) {
                ui.notifications.warn(`You need to have ${this.requireLevel} monk levels, you only have ${monkLevels}.`)
                return
            }

            if (entry) {
                pack.getDocument(entry._id).then(o => {
                    let template = `@Compendium[dnd5e.classfeatures.${entry._id}]{${this.name}}
                    ${o.data.data.description.value}`;
                    if (this.appendTemplate) {
                        template += '\n\n' + this.appendTemplate();
                    }
                    sendChat(template);
                    if (this.action) {
                        this.action();
                    }
                });
            } else {
                console.warn(`Could not find "${this.name}" entry in compendium.`);
                let template = this.fallbackText;
                if (this.appendTemplate) {
                    template += '\n\n' + this.appendTemplate();
                }
                sendChat(template);
                if (this.action) {
                    this.action();
                }
            }
        }
    }

    const openHand = !!actor.items.find(o => o.data.name === 'Open Hand Technique') ? `<br />In addition, you can impose one of the following: <ul><li>It must succeed on a <b>Dexterity</b> saving throw or be knocked prone.</li><li>It must make a <b>Strength</b> saving throw. If it fails, you can push it up to 15 feet away from you.</li><li>It can’t take reactions until the end of your next turn.</li></ul> Saving throw <b>DC ${10 + actor.data.data.abilities.wis.mod}</b>` : "";

    const features = [
        new KiFeature("Ki: Flurry of Blows",
            `Immediately after you take the <b>Attack</b> action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action. ${openHand}`,
            2,
            function () {
                // Automatically roll two Unarmed Strike attacks
                let strike = actor.items.find(o => o.data.name === 'Unarmed Strike' && o.labels.activation === '1 Action')
                if (strike) {
                    strike.roll();
                    strike.roll();
                }
            }),
        new KiFeature("Ki: Patient Defense",
            "You can spend 1 ki point to take the <b>Dodge</b> action as a bonus action on your turn.",
            2),
        new KiFeature("Ki: Step of the Wind",
            "You can spend 1 ki point to take the <b>Disengage</b> or <b>Dash</b> action as a bonus action on your turn, and your jump distance is doubled for the turn.",
            2),
        new KiFeature("Deflect Missiles",
            `Starting at 3rd level, you can use your reaction to deflect or catch the missile when you are hit by a ranged weapon attack. When you do so, the damage you take from the attack is reduced by 1d10 + your Dexterity modifier + your monk level. <br />

        If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in one hand and you have at least one hand free. If you catch a missile in this way, you can spend 1 ki point to make a ranged attack with the weapon or piece of ammunition you just caught, as part of the same reaction. You make this attack with proficiency, regardless of your weapon proficiencies, and the missile counts as a monk weapon for the attack, which has a normal range of 20 feet and a long range of 60 feet.`,
            3,
            null,
            function () {
                return `Damage reduction: [[/r 1d10+${actor.data.data.abilities.dex.mod}+${monkLevels}]]`;
            }),
        new KiFeature("Ki: Stunning Strike",
            "Starting at 5th level, you can interfere with the flow of ki in an opponent’s body. When you hit another creature with a melee weapon attack, you can spend 1 ki point to attempt a stunning strike. The target must succeed on a Constitution saving throw or be <b>stunned</b> until the end of your next turn.",
            5,
            null,
            function () {
                // Append the saving throw DC to the chat message
                return `CON saving throw (DC [[8+${actor.data.data.abilities.wis.mod}+@attributes.prof]])`;
            }),
        new KiFeature("Ki: Diamond Soul",
            `Beginning at 14th level, your mastery of ki grants you proficiency in all saving throws.

        Additionally, whenever you make a saving throw and fail, you can spend 1 ki point to reroll it and take the second result.`,
            14),
        new KiFeature("Ki: Empty Body",
            `Beginning at 18th level, you can use your action to spend 4 ki points to become invisible for 1 minute. During that time, you also have resistance to all damage but force damage.

        Additionally, you can spend 8 ki points to cast the astral projection spell, without needing material components. When you do so, you can’t take any other creatures with you.`,
            18,
            null,
            function () {
                return "Note: 4 ki points have been spent. Adjust manually if casting astral projection spell.";
            },
            4),
    ];

    const consumeKi = (feature, allowNegative, allowHigher) => {
        let hasAvailableResource = false;
        let selected = features.find(o => o.name == feature);
        let kiCost = selected.kiCost || 1;

        // Look for Resources under the Core actor data
        let resourceKey = Object.keys(actor.data.data.resources).filter(k => actor.data.data.resources[k].label === kiName).shift();
        if (resourceKey && (actor.data.data.resources[resourceKey].value >= kiCost || allowNegative)) {
            hasAvailableResource = true;
            actor.data.data.resources[resourceKey].value -= kiCost;
        }

        // Look for Ki Points Feat that has uses
        actor.items.filter(i => i.data.name === kiName && i.hasLimitedUses && (i.data.data.uses.value >= kiCost || allowNegative)).forEach(i => {
            hasAvailableResource = true;
            i.data.data.uses.value -= kiCost
        })

        if (!hasAvailableResource) {
            ui.notifications.warn(`${actor.name} does not have any ${kiName} left!`);
            return false;
        }
        if (actor.sheet.rendered) {
            // Update the actor sheet if it is currently open
            actor.render(true);
        }

        if (selected) {
            selected.render(allowHigher);
        }

        return true;
    };

    (async () => {
        let template = `
        <form>
            <div class="form-group">
                <label>Select feature:</label>
                <select id="feature" name="feature">`
        features.filter(o => o.requireLevel <= monkLevels).forEach(o => {
            template += `<option value="${o.name}">${o.name}</option>`;
        });
        template += `</select>
            </div>
            <div class="form-group">
                <label>Allow consuming Ki into negative? <input type="checkbox" id="allow-negative" name="allow-negative" value="1"></label>
            </div>
            <div class="form-group">
                <label>Allow consuming Ki feats of higher level? <input type="checkbox" id="allow-higher" name="allow-higher" value="1"></label>
            </div>
        </form>`;
        new Dialog({
            title: `Monk Ki Point Spender`,
            content: template,
            buttons: {
                yes: {
                    icon: "<i class='fas fa-check'></i>",
                    label: `Apply`,
                    callback: (html) => {
                        let feature = html.find('#feature')[0].value;
                        let allowNegative = html.find('#allow-negative')[0].checked;
                        let allowHigher = html.find('#allow-higher')[0].checked;
                        consumeKi(feature, allowNegative, allowHigher);
                    }
                },
                no: {
                    icon: "<i class='fas fa-times'></i>",
                    label: `Cancel`
                },
            },
            default: "yes"
        }).render(true);
    })();
})()
