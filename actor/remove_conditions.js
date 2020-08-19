(async () => {
  for ( let token of canvas.tokens.controlled ){
    await token.update({"effects": []});
  }
})();
