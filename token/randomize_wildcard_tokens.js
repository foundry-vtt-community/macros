for(let nextToken of canvas.tokens.placeables) {
    if (nextToken.actor.data.token.randomImg) {
        let tokenImgArray = await game.actors.get(nextToken.actor.id).getTokenImages();
        let imageChoice = Math.floor(Math.random() * tokenImgArray.length);
        let image = tokenImgArray[imageChoice]
    await nextToken.document.update({ "img": image })
    }
}
