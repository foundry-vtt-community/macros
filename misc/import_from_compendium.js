/** 
 * Import all the actors from a compendium.
 * In order to find the packName, you can use the following in your console (F12): game.packs.map(p => p.collection);
 * Author: KrishMero#1702
 */
 
let packName = 'dnd5e.heroes';
let pack = game.packs.get(packName);
let type = pack.metadata.entity.toLowerCase() + 's'; //grab the type and pluralize it.
pack.index.forEach(entry => game[type].importFromCollection(packName, entry._id));
