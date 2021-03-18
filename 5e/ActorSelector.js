// Credit for helping me with this macro goes to  @cole & @Kandashi on the Founddry Discord

//Selects all actors of the same name on the scene.
// eg: if you have a group of goblins mixed in with kobolds and you want to move all goblins
// select 1 goblin and run this macro
// all Goblins will now be selected

let tokens = canvas.tokens.placeables.filter(i => i.data.name === token.data.name)
tokens.forEach(i => i.control({ releaseOthers: false }))
