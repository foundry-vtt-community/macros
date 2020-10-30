let newNoteData = {};

for (let c of canvas.notes.children[0].children) {
    //newNoteData = duplicate(c.data);

    /*  
        Define new note properties
        double right-click a map pin for a list of valid fonts, icons, etc. 
        Remove the // in front of any line below to enable that change.    
    */

    //newNoteData.fontFamily = "Signika";
    //newNoteData.fontSize = 8;
    
    /* 
        replace the name of the icon, for example, the anchor would be "icons/svg/anchor.svg" 
    */ 
    //newNoteData.icon = "icons/svg/book.svg";
    //newNoteData.iconSize = 40;
    //newNoteData.iconTint = "";
    //newNoteData.text = "test";
    
    /*  
        textAnchor controls the location of the text in relation to the icon. 0-4 are valid choices.
        1 is the default, below. 0 hovers over the icon itself. 2 is above, 3 is left, 4 is right.  
    */
    //newNoteData.textAnchor = 1;
    //newNoteData.textColor = "#000000";
    //newNoteData.x = 2250;
    //newNoteData.y = 2050;

    c.update(newNoteData);

}

async () => {
    await canvas.draw()
} 