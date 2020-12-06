//This macro must be called 'GMConditions' and be on the GM's
//hot bar for the castMark.js macro to function correctly.
//you must tick the option 'Excecute Macro As GM' to grant
//players access to this macro.
//To do this you must create a new macro in your game and use
//the code below, dragging the macro from the compendium
//will not work.


const action = args[0]
const condition = args[1]
const targetId = args[2]
const target = canvas.tokens.get(targetId);
if (action == "apply"){
    game.cub.addCondition(condition, target, {replaceExisting: true})
}
else if (action == "remove"){
    game.cub.removeCondition(condition, target, {warn: true});
}
