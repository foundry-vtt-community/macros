// Rebinds the actor for all selected tokens.
// Requirements: 
//  - the actor must be present in the "Actor Directory"
//  - actor name can't contain either '/' or '.'

// Any Token with an altered name and an img path attached 
// will look up the default actor name via provided URL.
let tname, results, str, arr;

const dir = new ActorDirectory();

for (const token of canvas.tokens.controlled) {
   tname = token.name;
   results = dir.documents.filter(obj => {if(obj.data.name === tname){return obj;}})
   if(results.length === 0){
       if(token.data.img){
//      Possible optimization: regEx look-up for any word character pre '.' and post '/'
        str = token.data.img;
        arr = str.split('/');
        tname = arr[arr.length-1].split('.')[0];
        results = dir.documents.filter(obj => {if(obj.data.name === tname){return obj;}})
       }
   }
   if(results.length > 0){
        await token.update({'actorId':results[0].data._id});
   }
}
