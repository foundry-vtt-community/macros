// Randomizes all tokens on that scene to match their actors Wildcard options
// To apply to only controlled tokens, change the first line to: for(let nextToken of canvas.tokens.controlled) {

for (let nextToken of canvas.tokens.placeables) {
    if (nextToken.actor.data.token.randomImg) {
        let tokenImgArray = game.actors.get(nextToken.actor.id)._tokenImages;
        let imageChoice = Math.floor(Math.random() * tokenImgArray.length);
        let image = tokenImgArray[imageChoice]
        nextToken.update({ "img": image })
    }
}
