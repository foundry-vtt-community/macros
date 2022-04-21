//Script for macro that rolls the attack of a "strike"
//Must select a character with the associated "strike" for macro to work
//Replace the weapon 'Throwing Knife' with the name of the strike you want to attack with
    //ex 'Fist' or 'Dagger'
let weapon = 'Throwing Knife';
(actor.data.data.actions ?? []).filter(action => action.type === 'strike').find(strike => strike.name === weapon)?.attack(event);
