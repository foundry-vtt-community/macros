// Clones actor details from the selected token(s) into a new Actor in the item list.
// Useful if you made changes to the actor associated with the token, but want to save that
//  updated Actor for later use or into a Compendium.
// Created Actor will default to the name of the token with the actorNameSuffix (default: '_cloned')

// WORKS ONLY FOR LINKED ACTORS

const actorNameSuffix = "_cloned";

canvas.tokens.controlled.forEach(o => {
  Actor.create(o.actor).then(a => {
    a.update({name: a.name + actorNameSuffix});
  });
});
