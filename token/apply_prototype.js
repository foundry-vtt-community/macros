/**
 * Apply Prototype Token to all placed tokens of that actor.
 *
 * @author Forien#2130
 * @url https://www.patreon.com/foundryworkshop
 * @licence MIT
 */
 
// Optionally modify it to select specific actor. 
// By default takes actor of selected token, or if none is selected, then linked character
// let actor = ...;


if (!actor) return;
let tokens = actor.getActiveTokens();

let updates = tokens.map(t => {
  let token = duplicate(t.data);
  return mergeObject(token, actor.data.token);
});

if (updates.length)
  canvas.scene.updateEmbeddedDocuments("Token", updates);