// Credit for helping me with this macro goes to  @cole & @Kandashi on the Foundry Discord

//Selects all actors of the same name on the scene.
// eg: if you have a group of goblins mixed in with kobolds and you want to move all goblins
// select 1 goblin and run this macro
// all Goblins will now be selected
// this should still work in conjunction with Token Mold
let selectedId = canvas.tokens.controlled[0].document.actor.id

canvas.tokens.ownedTokens.forEach(i => {
  if(i.data.actorId == selectedId) {
    i.control({releaseOthers: false})
  }
})