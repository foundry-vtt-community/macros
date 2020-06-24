/** 
 * Import all the actors from a compendium. Change game.actors to game.items for items or to game.journal for journal entires.
 * In order to find the packName, you can use the following in your console (F12): game.packs.map(p => p.collection);
 * Author: KrishMero#1702
 */
 
let packName = 'dnd5e.heroes';
let pack = game.packs.get(packName);
pack.index.forEach(entry => game.actors.importFromCollection(packName, entry._id);
