// Update selected tokens to flip between a 1x1 or a 2x2 grid.

const updates = [];
for (let token of canvas.tokens.controlled) {
  let newSize = (token.data.height == 1 && token.data.width == 1) ? 2 : 1;
  updates.push({
    _id: token.id,
    height: newSize,
    width: newSize
  });
};

// use `canvas.tokens.updateMany` instead of `token.update` to prevent race conditions
// (meaning not all updates will be persisted and might only show locally)
canvas.scene.updateEmbeddedDocuments("Token", updates);
