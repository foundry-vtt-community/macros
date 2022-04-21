for (let scene of game.scenes){
  //Goes through the array of scenes and finds the active one.
    if (scene._view) {
        //Height, Width, and Padding offsets. 
        //scene data.height and scene.data.width give image size.
        //canvas dimensions give size including padding
        //xf, yf = x and y offsets.
        let h = scene.data.height;
        let w = scene.data.width;
        let xf = (canvas.dimensions.width - w)*0.5;
        let yf = (canvas.dimensions.height - h)*0.5;
        //Walls need two vertices: X Point 1, Y Point 1, X Point 2, Y Point 2
        //top wall, right wall, bottom wall, left wall
        let tw = [xf, yf, w + xf, yf];
        let rw = [w + xf, yf, w + xf, h + yf];
        let bw = [w + xf, h + yf, xf, h + yf];
        let lw = [xf, h + yf, xf, yf];
        //Creates walls. There is probably a cleaner way to do this.
        Wall.create({
            c: tw
        });
        Wall.create({
            c: rw
        });
        Wall.create({
            c: bw
        });
        Wall.create({
            c: lw
        });
    }
}
