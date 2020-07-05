/**
 * Replaces the reference id to other items/tables/journals/actors to use their name.
 * Useful for after importing journal records from a compendium that has references to actors/items/etc...
 * Author: @KrishMero#1792
 */
 
game.journal.forEach(entry => {
  let content = entry.data.content;
  let matches = content.match(/@\w*\[\w*\]/g);
  // now we have an array of things such as @Actor[5c8HWfrpvRV4XtZ1]
  let uniqueMatches = matches
    .filter((value, index, self) => self.indexOf(value) === index) //unique matches
    .forEach(str => {
      let arrayData = str.slice(1, -1).split('['); // cut off the @ and ] then make [0] the type and [1] the id.
      // since the reference may not match directly with the game entity type, lets look that up.
      let entityType = getEntityType(arrayData[0]);
      let id = arrayData[1];
      // with the id and our entity type, look up the name of the entry.
      let name = game[entityType].get(id)?.name;
      if (!name) {
        return ui.notifications.error(`Could not find any record for the entity type ${entityType} with the id of ${id}`);
      }

      // replace the ID with the name.
      console.log(`updating ${id} with ${name}`);

      let regEx = new RegExp(id, 'g');
      content.replace(regEx, name);
    }); 
  entry.update({ content });
});

function getEntityType(entity) {
  switch (entity) {
    case 'JournalEntry': return 'journal';
    case 'RollTable': return 'tables';
    default: return entity.toLowerCase() + 's';
  }
}
