// Courtesy of @fohswe
// Logs a troubleshooting message to the browser console.
// (You can usually view the browser console using F12.)

const gl = canvas.app.renderer.context.gl;

console.log(
`=== Start of troubleshooting ===
Background image: ${canvas.dimensions.width}x${canvas.dimensions.height}
Number of walls: ${canvas.scene.walls.size}
Number of selected vision sources: ${canvas.sight.sources.size}
Number of light sources: ${canvas.lighting.sources.size}
WebGL MAX_TEXTURE_SIZE: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}
`
);