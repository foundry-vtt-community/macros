/**
 * Macro to draw walls around Rectangles, Ellipses and Polygons.
 * Just select one or multiple drawings and klick the marcro.
 */
/** Constants */
const NUMPOINTS = 15; //Number of points for drawing a wall around an ellipse (NUMPOINTS is for one quarter of the ellipse)

let drawings = canvas.drawings.controlled;
drawings = drawings.map(drawing =>{
    switch (drawing.type) {
        case "p": { // In case of the drawing being a polygon
            let { _id, rotation, x, y} = drawing;
            let flatPoints = drawing.document.shape.points;
            let points = []
            for (let i = 0; i != flatPoints.length; i+=2){
                points.push([flatPoints[i], flatPoints[i+1]])
            }
            points.push([flatPoints[0], flatPoints[1]])
            
            let { width, height } = drawing.shape;
            return { id: _id, valid: true, points, rotation, x, y, width, height };
        }
        case "r": { // In case of the drawing being a rectangle
            let { _id, rotation, x, y} = drawing;
            let { width, height } = drawing.shape;
            let strokeWidth = drawing.document.strokeWidth;
            const points = [
                [0 + (strokeWidth / 2), 0 + (strokeWidth / 2)],
                [width - (strokeWidth / 2), 0 + (strokeWidth / 2)],
                [width - (strokeWidth / 2), height - (strokeWidth / 2)],
                [0 + (strokeWidth / 2), height - (strokeWidth / 2)],
                [0 + (strokeWidth / 2), 0 + (strokeWidth / 2)],
            ];
            return { id: _id, valid: true, points, rotation, x, y, width, height };
        }
        case "e" : { // In case of the drawing being an ellipse
            let {width, height} = drawing.shape;
            let {_id, rotation, x, y} = drawing
            let hw = Math.max(Math.abs(width/2), 0);
            let hh = Math.max(Math.abs(height/2), 0);
            let center = [hw, hh];
            let points = [];
            //Generate lower right quarter
            for (let i = 0; i != NUMPOINTS-1; i++){
                let Theta = Math.PI/2 * i / NUMPOINTS;
                Fi = Math.PI/2 - Math.atan(Math.tan(Theta) * center[0]/center[1]);
                x1 = center[0] + Math.round(center[0] * Math.cos(Fi));
                y1 = center[1] + Math.round(center[1] * Math.sin(Fi));
                points.push([x1,y1]);
            }

            let pointsQ = [...points];
            points.push([hw*2, hh])
            
            // Mirror up
            pointsQ.reverse().forEach(function(p){
                points.push([p[0], hh*2-p[1]]);
            })
            pointsQ = [...points];
            pointsQ.pop();
            // Mirrior left
            pointsQ.reverse().forEach(function(p){
                points.push([hw*2-p[0], p[1]]);
            })
            
            return { id: _id, valid: true, points, rotation, x, y, width, height };
        }
        default:
            return { id: drawing._id, valid: false };
    }
}).filter(drawing => {  // Check if a drawing came out as valid for processing.
    if (!drawing.valid) {
        ui.notifications.warn(`Drawing "${drawing.id}" is not a valid drawing type!`);
        return false;
    }
    return true;
});

if (drawings.length) {
    const newWalls = drawings.flatMap((drawing) => {
        const { x, y, width, height } = drawing;
        const xCenterOffset = width / 2;
        const yCenterOffset = height / 2;
        
        const θ = Math.toRadians(drawing.rotation);
        const cosθ = Math.cos(θ);
        const sinθ = Math.sin(θ);
        
        const points = drawing.points.map((point) => {
            const offsetX = point[0] - xCenterOffset;
            const offsetY = point[1] - yCenterOffset;
            const rotatedX = (offsetX * cosθ - offsetY * sinθ);
            const rotatedY = (offsetY * cosθ + offsetX * sinθ);
            return [rotatedX + x + xCenterOffset, rotatedY + y + yCenterOffset];
        });
        
        return points
            .slice(0, points.length - 1)
            .map((point, i) => ({ c: point.concat(points[i + 1]) }));
    });
    canvas.scene.createEmbeddedDocuments("Wall", newWalls); // Create Walls
    canvas.walls.activate(); // Activate Walls layer
} else {
    ui.notifications.error("No drawings selected!");
}

/**
 * TODO
 * - Check if there is already a wall for a drawing to recreate it instead of creating a second one. Might be possible with IDs.
 * - Add free had wall drawing to the functions, to convert a free drawing to a wall.
 */