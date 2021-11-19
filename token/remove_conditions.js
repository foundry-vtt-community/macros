(async () => {
  for ( let token of canvas.tokens.controlled ) {
    let effectsToDelete = token.actor.effects.filter(e => e.sourceName === "None")
      .map(e => { return e.id }); // documents api expects array of ids
    await token.actor.deleteEmbeddedDocuments("ActiveEffect", effectsToDelete);
}})();
