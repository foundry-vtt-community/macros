/*
 * Macro: Shopify WFRP4E actor
 * Version:0.9
 * Updated: 24-03-2021
 * Description: Adds WFRP trappings to a selected actor. The actor, compendium and availability types added are freely selectable. Quantities can also be set as per WFRP availability test rules.
 * Note: Shopify WFRP4E actor is based on previous work by Lars and Geekdad
 * Tip: The actor selector will default to 'Shop' if a character, npc or vehicle with that name is available
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
        packs.push({
          key: key.value,
          name: pack.metadata.label
        });
      }
    }
  }
  return packs;
}

function getActorNames() {
  let actors = [];
  game.actors.entities.forEach(table => {
    actors.push({
      key: table.id,
      name: table.name
    });
  });
  return actors;
}

function filterCommon(item) {
  return (item.data.data.availability && item.data.data.availability.value === "common") ? true : false
}

function filterScarce(item) {
  return (item.data.data.availability && item.data.data.availability.value === "scarce") ? true : false
}

function filterRare(item) {
  return (item.data.data.availability && item.data.data.availability.value === "rare") ? true : false
}

function filterExotic(item) {
  return (item.data.data.availability && item.data.data.availability.value === "exotic") ? true : false
}

function filterArmoury(item) {
  return (item.data.type === "weapon" || item.data.type === "ammunition" || item.data.type === "armour") ? true : false
}

function filterShop(item) {
  return (item.data.type === "trapping") ? true : false
  //  return (item.data.type === "trapping" &&  (item.data.data.trappingType.value==="clothingAccessories" || item.data.data.trappingType.value==="toolsAndKits" || item.data.data.trappingType.value==="booksAndDocuments" || item.data.data.trappingType.value==="foodAndDrink" || item.data.data.trappingType.value==="ingredient")) ? true : false
}


function filterHerbalist(item) {
  return (item.data.type === "trapping" && item.data.data.trappingType.value === "drugsPoisonsHerbsDraughts") ? true : false
}

function filterContainers(item) {
  return (item.data.type === "container") ? true : false
}

function getItem(pack, id) {
  let item = pack.getEntity(id).then(function(entity) {
    return entity
  })
  return item
}

async function addToActor(packKey, actorKey, enableArmoury, enableShop, enableContainers, enableCommon, enableScarce, enableRare, enableExotic, loc, option) {

  console.log("Getting compendium '" + packKey + "' and actor'" + actorKey + "'")

  let pack = game.packs.get(packKey);
  let actor = game.actors.get(actorKey);

  console.log("Getting all items with 'getEntity' and pushing them into the 'items' table");
  let items = [];
  await pack.getIndex();
  for (var i = 0; i < pack.index.length; i++) {
    let item = await pack.getEntity(pack.index[i]._id)
    items.push(item)
  }
  console.log(items)

  if (option === "optionEmpty") {
    console.log("Deleting actor's current items");
    let current = actor.data.items.map(i => i._id)
    await actor.deleteEmbeddedEntity("OwnedItem", current)
  }

  console.log("Applying filters");
  let inventory = items.filter(item => ((filterCommon(item) && enableCommon) || (filterScarce(item) && enableScarce) || (filterRare(item) && enableRare) || (filterExotic(item) && enableExotic)) && ((filterArmoury(item) && enableArmoury) || (filterShop(item) && enableShop) || (filterContainers(item) && enableContainers)))
  console.log(inventory)

  console.log("Creating new inventory");
  await actor.createEmbeddedEntity("OwnedItem", inventory)

  console.log("Updating quantities");
  let inventoryUpdate = actor.data.items.map(i => {

    let p = 0
    let m = 0
    let container = {
      _id: "",
      data: {
        quantity: {
          value: 0
        }
      }
    }
    container._id = i._id

    switch (i.data.availability.value) {
      case "common":
        p = (loc !== "none") ? 100 : 0
        m = 2
        break;
      case "scarce":
        p = (loc === "city") ? 90 : (loc === "town") ? 60 : (loc === "village") ? 30 : 0
        m = 1
        break;
      case "rare":
        p = (loc === "city") ? 45 : (loc === "town") ? 30 : (loc === "village") ? 15 : 0
        m = 0.5
        break;
      default:
        p = 0
        m = 0
    }
    let availabilityRoll = Math.floor(Math.random() * 100) + 1
    let base = (loc === "village") ? 1 : (Math.floor(Math.random() * 10) + 1)
    if (availabilityRoll <= p) {
      container.data.quantity.value = Math.ceil(base * m)
    } else {
      container.data.quantity.value = 0
    }
    //console.log("Availability Test '" + loc + "' for " + i.data.availability.value + " item '" + i.name + "'" + ((availabilityRoll <= p) ? "succeeded" : "failed") + " with " + availabilityRoll + "/" + p + ". baseQ: " + base + " modQ:" + m)
    //console.log("Returning entity '" + i.name + "' with quantity : " + container.data.quantity.value)
    return container
  })
  await actor.updateEmbeddedEntity("OwnedItem", inventoryUpdate)

}

/*main*/
let itemPacks = getPackNames();
let actorNames = getActorNames();

let content = `<form><div style="display: inline-block; width: 100%; margin-bottom: 10px">

<p>Add items from compendium to actor/token:</p>

<label for="output-targetPack" style="vertical-align: top; margin-right: 10px;">Select Compendium:</label><br/>
<select name='output-targetPack' id='output-targetPack' style="background-color: black;color: white;">`

itemPacks.forEach(item => {
  let def = ((item.name === "Trappings") ? `selected` : ``)
  content += `<option value='${item.key}' ` + def + `>${item.name}</option>`;
});
content += `</select><br/>

<label for="output-tableKey" style="vertical-align: top; margin-right: 10px;">Actor:</label><br />
<select name="output-tableKey" id="output-tableKey" style="background-color: black;color: white;">`

actorNames.forEach(table => {
  let def = ((table.name === "Shop") ? `selected` : ``)
  content += `<option value='${table.key}' ` + def + `>${table.name}</option>`;
});
content += `</select><br/>

<br/>

<p>Add items groupss</p>
<input type="checkbox"  id="enableArmoury" name="enableArmoury" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Armoury<br/>
<input type="checkbox"  id="enableShop" name="enableShop" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Shop<br/>
<input type="checkbox"  id="enableContainers" name="enableContainers" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Containers<br/>
<br/>

<p>Add items for availability types</p>
<input type="checkbox"  id="enableCommon" name="enableCommon" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Common<br/>
<input type="checkbox"  id="enableScarce" name="enableScarce" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Scarce<br/>
<input type="checkbox"  id="enableRare" name="enableRare" value=true  style="vertical-align: middle; margin-right: 10px;" checked>Rare<br/>
<input type="checkbox"  id="enableExotic" name="enableExotic" value=true  style="vertical-align: middle; margin-right: 10px;">Exotic<br/>
<br/>

<p>Set quantities per Availability Test rules</p>
<input type="radio" name="loc" id="village" value="village" style="margin-right: 10px;" checked>Village<br/>
<input type="radio" name="loc" id="town" value="town" style="margin-right: 10px;">Town<br/>
<input type="radio" name="loc" id="city"  value="city" style="margin-right: 10px;">City<br/>
<input type="radio" name="loc" id="none" value="none" style="margin-right: 10px;">None (0)<br/>
<br/>

<p>Current inventory options</p>
<input type="radio" name="options" id="optionEmpty" value="optionEmpty" style="vertical-align: middle; margin-right: 10px;" checked>Empty<br/>
<input type="radio" name="options" id="optionAdd" value="optionAdd" style="vertical-align: middle; margin-right: 10px;">Add<br/>
<br/>

</div><br /></form>`

new Dialog({
  title: `Shopify WFRP4E actor`,
  content: content,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: "Shopify Actor",
      callback: (html) => {
        let packKey = html.find("select[name='output-targetPack']").val();
        let actorKey = html.find("select[name='output-tableKey']").val();
        let enableArmoury = html.find("input[name='enableArmoury']:checked").val();
        let enableShop = html.find("input[name='enableShop']:checked").val();
        let enableContainers = html.find("input[name='enableContainers']:checked").val();
        let enableCommon = html.find("input[name='enableCommon']:checked").val();
        let enableScarce = html.find("input[name='enableScarce']:checked").val();
        let enableRare = html.find("input[name='enableRare']:checked").val();
        let enableExotic = html.find("input[name='enableExotic']:checked").val();
        let loc = html.find("input[name='loc']:checked").val();
        let option = html.find("input[name='options']:checked").val();
        addToActor(packKey, actorKey, enableArmoury, enableShop, enableContainers, enableCommon, enableScarce, enableRare, enableExotic, loc, option);
      }
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: 'Cancel'
    }
  },
  default: "yes"
}).render(true);
