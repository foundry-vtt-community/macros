/**
 * Author: github.com/elizeuangelo
 */

function checkDegreeOfSuccess(check, dc) {
	// Returns the degree of success of a check, according to PF2e rules
	const diff = check - dc;
	let res = 0;
	if (diff > -10) res++;
	if (diff > -1) res++;
	if (diff > 9) res++;
	return res;
}
function rollRepair(dc, assurance) {
	// Rolls the repair test and returns the result
	if (assurance) {
		const prof = actor.data.data.skills.cra.modifiers.find((mod) => mod.type === 'proficiency');
		const total = 10 + prof.modifier;
		return { total, data: { degreeOfSuccess: checkDegreeOfSuccess(total, dc) } };
	}
	const options = actor.getRollOptions(['all', 'skill-check', 'craft']);
	return new Promise((resolve) => {
		actor.data.data.skills.cra.roll({
			dc: { value: dc },
			event,
			options,
			callback: (roll) => resolve(roll),
		});
		setTimeout(() => resolve(undefined), 30000);
	});
}
function getRollTooltip(roll) {
	// Returns a message's roll tooltip
	return `<a class="inline-roll inline-result" title="${roll.formula}" data-roll="${escape(JSON.stringify(roll))}">
                                            <i class="fas fa-dice-d6"></i> ${roll.total}</a>`;
}
function note(msg) {
	// Returns a note styled message
	return `<p class="compact-text">${msg}</p>`;
}
// If no token is selected, notify and return
if (!token) {
	ui.notifications.warn('No token is selected');
	return;
}
let repairKits = false,
	reparableItems = [],
	assurance = false;
// Gathers all the actor items and feats only once
actor.items.forEach((i) => {
	if (i.data.data.hp?.value && i.data.data.hp.value < i.data.data.maxHp?.value) {
		reparableItems.push(i);
	}
	if (/repair kit/i.exec(i.name)) {
		repairKits = true;
	}
	if (i.type === 'feat' && i.slug === 'assurance-crafting') {
		assurance = true;
	}
});
// If there are no Repair Kits in inventory, notify and return
if (!repairKits) {
	ui.notifications.warn('There are no repair kits on the selected token');
	return;
}
// Sort the Reparable Items by descending order according to the damage (max - current hp)
reparableItems = reparableItems.sort((a, b) => b.data.data.maxHp.value - b.data.data.hp.value - (a.data.data.maxHp.value - a.data.data.hp.value));
// Adds a Generic Item Option
reparableItems.push({ name: 'Any Item', type: 'generic', data: { data: { hp: { value: NaN }, maxHp: { value: NaN } } } });
const heal = 5 * (1 + actor.data.data.skills.cra.rank);
const itemLevels = [];
for (let i = 0; i < 21; i++) {
	itemLevels.push(~~((i + 1) * 1.33) + 13);
}
// Creates the dropdown menus selection
const itemNames = reparableItems.map((i) => i.name + ` (${i.data.data.hp.value || '??'}/${i.data.data.maxHp.value || '??'})`);
const html = `
<form autocomplete="off">
    <div>
        Select the repair kit you are using, the item you repairing and a target DC.
        Destroyed items (0 HP) cant be repaired and are not shown in the list.
    </div>
    <hr/>
    <p class="notes">A success repairs ${heal} HP (${heal * 2} on a critical).</p>
    <div class="form-group">
        <label>Item:</label>
        <select id="item" name="item">
            {{#each itemNames}}
            <option value="{{@index}}">{{this}}</option>
            {{/each}}
        </select>
    </div>
    <div class="form-group">
        <label>Item Level (Craft DC):</label>
        <select id="dc-level" name="dc-level">
        {{#each itemLevels}}
            <option value="{{@index}}">{{@index}} (DC {{this}})</option>
        {{/each}}
        </select>
    </div>
    <div class="form-group">
        <label>DC Modifier:</label>
        <input type="number" id="modifier" name="modifier"/>
    </div>
    <div class="form-group" {{#if assurance}}style="display:none"{{/if}}>
        <label>Assurance? <i>(I dont like to roll)</i></label>
        <input type="checkbox" id="assurance" name="assurance"/>
    </div>
</form>
`;
const dialog = new Dialog(
	{
		title: 'Repair Item',
		content: Handlebars.compile(html)({ itemLevels, itemNames, assurance: !assurance }),
		buttons: {
			yes: {
				icon: `<i class="fas fa-toolbox"></i>`,
				label: 'Repair',
				callback: async (html) => {
					// First get the data
					const item = reparableItems[html.querySelector('#item').value];
					const dcLevel = html.querySelector('#dc-level').value;
					const modifier = html.querySelector('#modifier').value;
					const assurance = html.querySelector('#assurance').checked;
					const dc = itemLevels[dcLevel] + +modifier;
					// Roll
					const result = await rollRepair(dc, assurance);
					if (!result) return;
					const success = result.data.degreeOfSuccess;
					const successText = {
						0: 'Critical Failure',
						1: 'Failure',
						2: 'Success',
						3: 'Critical Success',
					};
					// Header
					const content = [];
					const tags = [`DC ${dc}`, `Item Level ${dcLevel}`, `${item.name} (${item.data.data.hp.value}/${item.data.data.maxHp.value})`];
					if (item.data.data.hardness?.value) tags.push(`Hardness ${item.data.data.hardness.value}`);
					if (assurance) tags.push(`Assurance ${result.total}`);
					content.push(
						`<span class="flavor-text"><strong><span class="pf2-icon">F</span> <b>${
							assurance ? 'Assured ' : ''
						}Repair</b> <p class="compact-text">(${successText[success]})</p></strong><div class="tags">${tags
							.map((b) => `<span class="tag">${b}</span>`)
							.join('')}</div><hr>`
					);
					// Proceed the results
					let newHp;
					if (!success) {
						// If it is a critical failure
						const dmgRoll = Roll.create(`2d6 - ${item.data.data.hardness?.value || 0}`).roll();
						newHp = Math.max(item.data.data.hp.value - dmgRoll.total, 0);
						const rollTooltip = getRollTooltip(dmgRoll);
						if (dmgRoll.total > 0) {
							// If the item is damaged
							content.push(
								note(
									`You fail miserably to repair <strong>${item.name}</strong> (${newHp}/${item.data.data.maxHp.value}) and you accidentaly damage it for ${rollTooltip} damage.`
								)
							);
							if (newHp === 0) {
								content.push(note(`<strong>${item.name}</strong> is destroyed.`));
							}
						} else {
							// If damage is 0
							content.push(
								note(
									`You fail miserably to repair <strong>${item.name}</strong> (${newHp}/${item.data.data.maxHp.value}) but the item resists taking damage ${rollTooltip}.`
								)
							);
						}
					} else if (success === 1) {
						// If its a failure
						content.push(note(`You fail to repair <strong>${item.name}</strong> (${item.data.data.hp.value}/${item.data.data.maxHp.value}).`));
					} else {
						// If its a success or critical success
						const repair = heal * (success - 1);
						newHp = Math.min(item.data.data.hp.value + repair, item.data.data.maxHp.value);
						content.push(
							note(`You repair <strong>${item.name}</strong> for +<strong>${repair}</strong> HP (${newHp}/${item.data.data.maxHp.value}).`)
						);
					}
					if (success === 3) content.push(note('<i>Golden Hands</i>'));
					if (item.type !== 'generic' && newHp !== undefined) item.update({ 'data.hp.value': newHp });
					ChatMessage.create({ flavor: content.join('').replaceAll('NaN', '??'), speaker: { alias: actor.name } });
				},
			},
			no: {
				icon: `<i class="fas fa-times"></i>`,
				label: 'Cancel',
			},
		},
		default: 'yes',
		render: (html) => {
			const dcLevel = html.querySelector('#dc-level');
			html.querySelector('#item')?.addEventListener('change', (ev) => {
				const item = reparableItems[+ev.target.value];
				if (item.type === 'generic') {
					dcLevel.disabled = false;
					return;
				}
				dcLevel.disabled = true;
				dcLevel.value = item.data.data.level.value;
			});
			if (reparableItems[0].type !== 'generic') {
				dcLevel.disabled = true;
				dcLevel.value = reparableItems[0].data.data.level.value;
			}
		},
	},
	{ jQuery: false }
);
dialog.render(true);
