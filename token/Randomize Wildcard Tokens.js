// To apply to only controlled tokens, change the first line to:
// for(let nextToken of canvas.tokens.controlled) {
async function randomizeImages() {
for(let nextToken of canvas.tokens.placeables) {
    if (nextToken.actor.data.token.randomImg) {
        let tokenImgArray = await game.actors.get(nextToken.actor.id).getTokenImages();
        let imageChoice = Math.floor(Math.random() * tokenImgArray.length);
        let image = tokenImgArray[imageChoice]
        nextToken.update({ "img": image })
    }
}
}
randomizeImages()
