// starts rage using the rage effect.  With the new effect system in place other rage macros should be obsolete (including the one included in the core system

const ITEM_UUID = 'Compendium.pf2e.feature-effects.z3uyCMBddrPK5umr'; // Effect: Rage

(async () => {
  const item = await fromUuid(ITEM_UUID);
  for (const token of canvas.tokens.controlled) {
    let existing = token.actor.items.filter(i => i.type === item.type).find(e => e.name === item.name);
    if (existing) {
      await token.actor.deleteOwnedItem(existing._id);
    } else {
      let owneditemdata = await token.actor.createOwnedItem(item);
      owneditemdata.data.start.value=game.time.worldTime;
    }
  }
})();
