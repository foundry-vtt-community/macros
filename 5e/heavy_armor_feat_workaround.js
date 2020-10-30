//Crude but effective way to simulate Heavy Armor Master.
//Every time the player takes eligible damage, they can just click this macro with their token selected to "get their 3HP back."
//Questions? Ask in #macro-polo on Discord. If absolutely needed, please ping Norc#5108.

//Known minor limitation: Does not take into account temp HP AT ALL.

function modifyHP(token, amount) {
    let hp_cur = token.actor.data.data.attributes.hp.value;
    let hp_max = token.actor.data.data.attributes.hp.max;
    let hp_min = token.actor.data.data.attributes.hp.min;
    hp_cur = (hp_cur+amount > hp_max) ? hp_max : hp_cur+amount;
    hp_cur = (hp_cur < hp_min) ? hp_min : hp_cur;
    token.actor.update({'data.attributes.hp.value': parseInt(hp_cur)});
    return hp_cur;
  }

if(token) {
    //Note: Just change the number after the comma to heal/receive other HP values. Negative numbers indicate damage.
    modifyHP(token,3);
} else {
    ui.notifications.notify("Please select a token.");
}6
