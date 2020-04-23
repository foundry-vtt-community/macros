// Courtesy of @fohswe
// Logs a troubleshooting message to the browser console.
// (You can usually view the browser console using F12.)

const gl = canvas.app.renderer.context.gl;

console.log(
`=== Start of troubleshooting ===
Background image: ${canvas.background.img.width}x${canvas.background.img.height}
Number of walls: ${canvas.scene.data.walls.length}
Number of selected vision sources: ${canvas.sight.sources.vision.size}
Number of light sources: ${canvas.sight.sources.lights.size}
WebGL MAX_TEXTURE_SIZE: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}
`
);