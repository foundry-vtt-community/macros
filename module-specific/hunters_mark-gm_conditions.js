//This macro must be called 'GMConditions' and be on the GM's
//hot bar for the castMark.js macro to function correctly.
//you must tick the option 'Excecute Macro As GM' to grant
//players access to this macro.


const action = args[0]
const condition = args[1]
const targetId = args[2]
const target = canvas.tokens.get(targetId);
if (action == "apply"){
    game.cub.applyCondition(condition, target, {warn: true});
}
else if (action == "remove"){
    game.cub.removeCondition(condition, target, {warn: true});
}
