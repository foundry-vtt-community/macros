  ui.notifications.warn(`${token.name} stands up`);     
            (async () => {    
    if(actor.items.find(entry => (entry.name === "Prone"))){
    let prone = actor.items.find(entry => (entry.name === "Prone" && entry.type === "condition"));
      await  PF2eConditionManager.removeConditionFromToken(prone._id, token)
    }
    
    if (actor.items.find(entry => (entry.name === "Flat-Footed"))){
    let flatfooted = actor.items.find(entry => (entry.name === "Flat-Footed" && entry.type === "condition"));
      await  PF2eConditionManager.removeConditionFromToken(flatfooted._id, token)
}
            })();

    
