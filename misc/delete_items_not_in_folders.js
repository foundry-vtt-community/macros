/**
 * Clears the actors entity of any entries not in a folder.
 * Change 'actors' to another game entity such as tables, items, macros, etc... to clear items not in directory for those places.
 * Author: KrishMero#1792
 */
 
 game.actors.forEach(t => {
  if (!t.data.folder) {
    t.delete();
  }
});
