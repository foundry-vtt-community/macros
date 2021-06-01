// Unlinks all currently-selected tokens from their actors. This is useful if you're running
// combat with several copies of the same enemy, as if they're all linked to the same actor,
// applying damage to one applies damage to all. Select all the baddies and apply this macro
// to be able to track their HP individually.

canvas.tokens.updateAll(
  t => ({ actorLink: false }),
  t => t._controlled
);
