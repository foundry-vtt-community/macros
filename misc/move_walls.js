/* From: @(Busy) Gen Kitty (she/her)
To move each node on both axes, you need all 4 parameters listed. 
In this case, he wanted to move all the walls up and to the left and 
the foundry grid is sorta vertically flipped to what you'd expect, 
which is why all of the operators are "-=" If you wanted to move them 
in different directions it'd just be a matter of changing the operator 
next to the equals sign.

Each argument is a node's X or Y position, and each wall segment has two nodes. 
0 = Node 1 X 
1 = Node 1 Y 
2 = Node 2 X 
3 = Node 2 Y
*/

let walls = canvas.scene.data.walls.map(w => {
  w = duplicate(w);
  w.c[0] -= 50;
  w.c[1] -= 50;
  w.c[2] -= 50;
  w.c[3] -= 50;
  return w;
});
canvas.scene.update({walls: walls});
