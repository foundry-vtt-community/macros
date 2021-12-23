/**
 * Clears the actor Documents of any entries not in a folder.
 * Change 'actors' in game.actors.filter to items, macros, tables, journal etc. to get the entry not in a folder.
 * Change 'Actor' to another game Document such as RollTable, Item, Macro, JournalEntry, etc... to delete the correct Document type.
 * Author: Freeze#2689
 */
 const deleteIds = game.actors.filter(e => e.folder === null).map(e => e.id);
 Actor.deleteDocuments(deleteIds);
