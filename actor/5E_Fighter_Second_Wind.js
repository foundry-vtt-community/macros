//With your fighter token selected, click this macro to regain your second wind.
//Questions? Ask in #macro-polo on Discord. If absolutely needed, please ping Norc#5108.

//TO DO:    Add option to check for available Second Wind uses and automatcally expend one.
//          Add additional option to fail usage if no uses left.

function modifyHP(token, amount) {
    //Known minor limitation: Does not take into account temp HP AT ALL.
    let hp_cur = token.actor.data.data.attributes.hp.value;
    let hp_max = token.actor.data.data.attributes.hp.max;
    let hp_min = token.actor.data.data.attributes.hp.min;
    hp_cur = (hp_cur+amount > hp_max) ? hp_max : hp_cur+amount;
    hp_cur = (hp_cur < hp_min) ? hp_min : hp_cur;
    token.actor.update({'data.attributes.hp.value': parseInt(hp_cur)});
    return hp_cur;
  }

if(token) {
    let fighter = actor.items.find(i => i.name == "Fighter");
    if (fighter)  {
        let fighterLevel = parseInt(fighter.data.data.levels);
        let formula = `1d10 + ${fighterLevel}`;
        console.log(formula);
        let amount = new Roll(formula).roll().total; 
        //Note: Just change the number after the comma to heal/receive other HP values. Negative numbers indicate damage.
        modifyHP(token, amount);
    } else {
        ui.notifications.notify("Please select a token that has at least one Fighter level.");
    } 
} else {
    ui.notifications.notify("Please select a token.");
}