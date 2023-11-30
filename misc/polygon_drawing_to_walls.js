/**
 * Converts selected polygon drawing to a wall
 * @Author: cole#9640
 */

let drawings = canvas.drawings.controlled;

drawings = drawings.filter(drawing => {
    if (!drawing.isPolygon) {
        ui.notifications.warn(`Drawing "${drawing.document._id}" is not a polygon, skipping`);
        return false;
    }
    return true;
});

if (drawings.length) {
    const newWalls = drawings.flatMap((drawing) => {
        const { x, y } = drawing.document;
        const { width, height } = drawing.document.shape;
        const xCenterOffset = width / 2;
        const yCenterOffset = height / 2;

        const o = Math.toRadians(drawing.document.rotation);
        const coso = Math.cos(o);
        const sino = Math.sin(o);

        pts = drawing.document.shape.points;
        points = [];
        for (i = 0; i < pts.length - 1; i += 2) {
            const offsetX = pts[i] - xCenterOffset;
            const offsetY = pts[i + 1] - yCenterOffset;
            const rotatedX = (offsetX * coso - offsetY * sino);
            const rotatedY = (offsetY * coso + offsetX * sino);
            points.push([rotatedX + x + xCenterOffset, rotatedY + y + yCenterOffset]);
        }
        return points.slice(0, points.length - 1)
            .map((point, i) => {
                return { c: point.concat(points[i + 1]) };
            });
    });

    canvas.scene.createEmbeddedDocuments("Wall", newWalls).then(as => { canvas.walls.activate(); });

} else {
    ui.notifications.error("No polygon drawings selected!");
}
