/**
 * Converts selected polygon drawing to a wall
 * @Author: cole#9640
 */

 function toRadians(degrees)
 {
   var pi = Math.PI;
   return degrees * (pi/180);
 }
 
 
 let drawings = canvas.drawings.controlled;
 
 drawings = drawings.filter(drawing =>  {
     if (!drawing.isPolygon) {
         ui.notifications.warn(`Drawing "${drawing.data._id}" is not a polygon, skipping`);
         return false;
     }
     return true;
 });
 
 if (drawings.length) {
     const newWalls = drawings.flatMap((drawing) => {
         const { x, y, width, height } = drawing.data;
         const xCenterOffset = width/2;
         const yCenterOffset = height/2;
         
         const θ = toRadians(drawing.data.rotation);
         const cosθ = Math.cos(θ);
         const sinθ = Math.sin(θ);
         
         const points = drawing.data.points.map((point) => {
             const offsetX = point[0] - xCenterOffset;
             const offsetY = point[1] - yCenterOffset;
             const rotatedX = (offsetX * cosθ - offsetY * sinθ);
             const rotatedY = (offsetY * cosθ + offsetX * sinθ);
             return [rotatedX + x + xCenterOffset, rotatedY + y + yCenterOffset];
         });
         
         return points.slice(0, points.length - 1)
             .map((point, i) => {
                 return { c: point.concat(points[i + 1]) };
             });
     });
     
     canvas.scene.createEmbeddedDocuments("Wall", newWalls);
     canvas.walls.activate();
 } else {
     ui.notifications.error("No polygon drawings selected!");
 }