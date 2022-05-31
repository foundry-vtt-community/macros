/*
 * Macro: Lars's Merchant generator based on "GeekDad's Compendium to Table Script"
 * Version: 1
 * Updated: 08-03-2021
 * Description: A nice friendly UI that takes a compendium and appends items for specific types to an actor.
 *   Smith: will have ammo, equipment and weapons
 *   General store: will have common items but not scroll and potions
 *   Magic: will have all that is left of consumables and loot from the general store 
*/

function getPackNames() {
    let packs = [];
    let keys = game.packs.keys();
    let done = false;
    while (!done) {
        let key = keys.next();
        done = key.done;
        if (!done) {
            let pack = game.packs.get(key.value);
            if (pack.metadata.entity === "Item") {
                packs.push({ key: key.value, name: pack.metadata.label });
            }
        }
    }
    return packs;
}

function getActorNames() {
    let actors = [];
    game.actors.entities.forEach(table => {
        actors.push({ key: table.id, name: table.name });
    });

    return actors;
}

async function addItemToActor(itemPromise, actor) {
    let item = await itemPromise
    actor.createOwnedItem(item.data);
}

function getPriceForRarity(rarity) {
    if (rarity === "Common") {
        let r = new Roll("(1d6 + 1)");
        r.evaluate();
        return r.result * 10
    } else if (rarity === "Uncommon") {
        let r = new Roll("1d6");
        r.evaluate();
        return r.result * 100
    } else if (rarity === "Rare") {
        let r = new Roll("2d10");
        r.evaluate();
        return r.result * 1000
    } else if (rarity === "Very Rare") {
        let r = new Roll("(1d4 + 1)");
        r.evaluate();
        return r.result * 10000
    } else if (rarity === "Legendary") {
        let r = new Roll("2d6");
        r.evaluate();
        return r.result * 25000
    }
    return 0;
}

function getItem(pack, id, itemType) {
    let item = pack.getEntity(id).then(function(result) {
        if (result.data.data.rarity === "Common") {
            result.data.data.quantity = 100
        }
        if (result.data.data.price === 0) {
            result.data.data.price = getPriceForRarity(result.data.data.rarity)
        }
        if (itemType === "Smith" && (result.data.type === "ammunition" || result.data.type === "equipment" || result.data.type === "weapon")) {
            return result
        }
        if ((result.data.type === "consumable" || result.data.type === "loot")) {
            if (result.data.data.rarity === "Common" && (result.data.type === "consumable" && result.data.data.consumableType !=='potion' && result.data.data.consumableType !== 'scroll') && itemType === "GS") {
                return result
            } else if (itemType === "GS" && result.data.data.consumableType !== 'ammunition') {
            } else if (itemType === "MS") {
                if (result.data.data.rarity === "Common" && ((result.data.type === "consumable" && result.data.data.consumableType != 'potion' && result.data.data.consumableType != 'scroll')
                || ((result.data.type === "loot")))) {
                    console.log("Skip general store item: " + result.name)
                } else {
                    return result
                }
            }
        }
        return "EMPTY"
    })
    return item
}


function generateMagicItemsStock(roll, list, actor, rollFormula) {
    for (let i = 0; i < roll.result; i++) {
        let r = new Roll(rollFormula);
        r.evaluate();
        let item = list[Math.floor(Math.random() * list.length)]
        item.data.data.quantity = r.result
        addItemToActor(item, actor)
    }
}

async function addToActor(packKey, actorKey, itemType,disableCommon,uncommon,rare,veryRare,legendary) {
    let pack = game.packs.get(packKey);
    let actor = game.actors.get(actorKey);

    await pack.getIndex();
    let items = [];
    for (var i = 0; i < pack.index.length; i++) {
        let item = await getItem(pack,pack.index[i]._id,itemType)
        if (item !== "EMPTY") {
            items.push(item)
        }

    }
    if ((disableCommon === undefined)) {
        console.log("add common items")
        items.filter(item => item.data.data.rarity === "Common").forEach(item => addItemToActor(item, actor))
    }
    if (uncommon !== "") {
        let roll = new Roll(uncommon);
        roll.evaluate();
        let list = items.filter(item => item.data.data.rarity === "Uncommon");
        generateMagicItemsStock(roll, list, actor,uncommon);
    }
    if (rare !== "") {
        let roll = new Roll(rare);
        roll.evaluate();
        let list = items.filter(item => item.data.data.rarity === "Rare");
        generateMagicItemsStock(roll, list, actor,rare);
    }
    if (veryRare !== "") {
        let roll = new Roll(veryRare);
        roll.evaluate();
        let list = items.filter(item => item.data.data.rarity === "Very Rare");
        generateMagicItemsStock(roll, list, actor,veryRare);
    }
    if (legendary !== "") {
        let roll = new Roll(legendary);
        roll.evaluate();
        let list = items.filter(item => item.data.data.rarity === "Legendary");
        generateMagicItemsStock(roll, list, actor,legendary);
    }
}

let itemPacks = getPackNames();
let actorNames = getActorNames();

let content = `<form><div style="display: inline-block; width: 100%; margin-bottom: 10px">
  <p>This script will append the selected compendium to the selected actor.</p>
  <label for="output-targetPack" style="vertical-align: top; margin-right: 10px;">Select Pack:</label>
  <br/><select name='output-targetPack' id='output-targetPack'>`

itemPacks.forEach(item => {
    content += `<option value='${item.key}'>${item.name}</option>`;
});

content += `</select><br/><label htmlFor="output-targetType" style="vertical-align: top; margin-right: 10px;">Type of item:</label>
            <br/><select name='output-targetType' id='output-targetType'>`

content += `<option value='Smith'>Smith</option>`;
content += `<option value='GS'>General store</option>`;
content += `<option value='MS'>Magic shop</option>`;

content += `</select><br/><label for="output-tableKey" style="vertical-align: top; margin-right: 10px;">Actor:</label><br /><select name="output-tableKey" id="output-tableKey">`

actorNames.forEach(table => {
    content += `<option value='${table.key}'>${table.name}</option>`;
});

content += `</select><br>

<label for="disableCommon"> Disable common items</label>
<input type="checkbox"  id="disableCommon" name="disableCommon" value="disableCommon"><br/>

<label for="uncommon">Random Uncommon e.g. 1d6</label>
<input type="text" id="uncommon" name="uncommon" value=""><br>

<label for="rare">Random Rare e.g. 1d6</label>
<input type="text" id="rare" name="rare" value=""><br>

<label for="veryRare">Random Very Rare e.g. 1d6</label>
<input type="text" id="veryRare" name="veryRare" value=""><br>

<label for="legendary">Random Legendary e.g. 1d6</label>
<input type="text" id="legendary" name="legendary" value=""><br>
</div><br /></form>`

new Dialog({
    title: `GeekDad's Compendium to Actor Generator`,
    content: content,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: "Convert",
            callback: (html) => {
                let packKey = html.find("select[name='output-targetPack']").val();
                let actorKey = html.find("select[name='output-tableKey']").val();
                let itemType = html.find("select[name='output-targetType']").val();
                let disableCommon = html.find("input[name='disableCommon']:checked").val();
                let uncommon = html.find("input[name='uncommon']").val();
                let rare = html.find("input[name='rare']").val();
                let veryRare = html.find("input[name='veryRare']").val();
                let legendary = html.find("input[name='legendary']").val();
                addToActor(packKey, actorKey,itemType,disableCommon,uncommon,rare,veryRare,legendary);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: 'Cancel'
        }
    },
    default: "yes"
}).render(true);
