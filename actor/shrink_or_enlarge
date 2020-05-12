// Update selected tokens to flip between a 1x1 or a 2x2 grid.

for (let token of canvas.tokens.controlled) {
  let newSize = (token.data.height == 1 && token.data.width == 1) ? 2 : 1;
  token.update({
    height: newSize,
    width: newSize
  });
};
