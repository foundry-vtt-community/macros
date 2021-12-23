// Create a (pre-configured) lightsource on the current scene. 
// This example is a blue light for "activating a stargate."

canvas.scene.createEmbeddedDocuments("AmbientLight", [{
    t: "l", // l for local. The other option is g for global.
    x: 1500, // horizontal positioning
    y: 1150, // vertical positioning
    rotation: 0, // the beam direction of the light in degrees (if its angle is less than 360 degrees.) 
    config: { 
        dim: 20.50, // the total radius of the light, including where it is dim.
        bright: 19.00, // the bright radius of the light
        angle: 360, // the coverage of the light. (Try 30 for a "spotlight" effect.)
        
                    // Oddly, degrees are counted from the 6 o'clock position.
        color: "#0080FF", // Light coloring.
        alpha: 0.5
    } // Light opacity (or "brightness," depending on how you think about it.) 
}]);
