// A simple macro for maximizing creature HP

const dir = new ActorDirectory();
const regEx = /(\d+d\d+)/;

dir.documents.forEach(function(obj){
    let formula, match, math, solution;
    let attributes = obj.data.data.attr;
    if(!attributes){ return; }
    formula = attributes.hp.formula;
    if(!formula){return;}
    match    = formula.match(regEx);
    if(!match){return;}
    math     = match[0].replace('d','*');
    math     = '('+math+')';
    formula  = formula.replace(match[0], math);
    solution = eval(formula);
    obj.data.data.attr.hp.value = solution;
    obj.data.data.attr.hp.max = solution;
    console.log(obj.data.name);
  });
