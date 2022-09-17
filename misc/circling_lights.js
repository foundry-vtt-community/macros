//Macro made on FoundryVTT version 9 build 269. No module or system dependencies.

/*
Instructions:
Set the light in its central point before running the macro. Running this macro a second time will stop the motion and return the lights to the center. Lights will always be turned on when moving and turned off when stopped.
Don't use too many of these as it is constantly updating light position and will definitely affect performance.
*/

/** 
	Control Section 
*/
/* The below array allows you to target specific lights. Enter the ids into the array, obtained by opening up the individual properties of the light.*/
let targetlightid = [
    "lightid_1", 
    "lightid_2"
    ]
    let measuretype = "grid" //acceptable values are "pixels" or "grid". If grid is used, measurements are based on grid size.
    let radius = 1; //radius of the circle in pixels or grid spaces, depending on the selection above.
    let direction = "clockwise"; //accepted values are "clockwise" or "widdershins".
    let speed = 100; //interval time in milliseconds. Lower values will move the light faster, but also hits performance harder.
    /** 
        End Control Section 
    */
    /** 
        The below is pure code controlled by the above settings. There is no need to change it. 
    */
    let gridsize = canvas.scene.data.grid;
    if (measuretype==="grid"){radius = radius*gridsize}
    let scene = game.scenes.active;
    let scenelights = canvas.lighting.placeables;
    let movesize = 360/(radius*4); //this keeps the movement smooth, regardless of the size of the circle.
    let directionmultiplier;
    if(direction==="widdershins"){directionmultiplier=-1} else {directionmultiplier=1}
    async function updatelighting(newdata) {
        await scene.updateEmbeddedDocuments("AmbientLight", newdata);
    }
    function radial_light() {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        for (let i of scenelights) {
            if(targetlightid.includes(i.data._id)) {
                let x0 = i.data.x;
                let y0 = i.data.y;
                if(i.data.radialmotion==="on"||i.data.radialmotion==="standby"){
                    function updatepositionstop(){
                        i.data.radialmotion="stop";
                        newdata = [];
                        newdata.push({_id:i.data._id,
                            radialmotion: "stop"
                        });
                        updatelighting(newdata);	
                    }
                    updatepositionstop()
                };	
                if(i.data.radialmotion===undefined){
                    i.data.radialmotion="standby";
                    function updatepositionstandby(){
                        newdata = [];
                        newdata.push({_id:i.data._id,
                            radialmotion: "standby"
                        });
                        updatelighting(newdata);	
                    };
                    updatepositionstandby()
                }
                function movelight() {
                    if(i.data.radialmotion==="stop"){
                        i.data.radialmotion = undefined;
                        function updateposition(){
                            newdata = [];
                            newdata.push({_id:i.data._id,
                                x: x0,
                                y: y0,
                                hidden: true,
                                offsetrotation: 0,
                                radialmotion: undefined
                            });
                            updatelighting(newdata);	
                        }
                        updateposition()
                        return
                    } else {
                        if(i.data.offsetrotation === undefined){i.data.offsetrotation = 0}
                        i.data.offsetrotation += movesize;
                        let newoffsetrotation = i.data.offsetrotation;
                        let radians = Math.PI*i.data.offsetrotation/180*directionmultiplier;
                        let newX = x0 + (radius * Math.cos(radians));
                        let newY = y0 + (radius * Math.sin(radians));	
                        function updateposition(){
                            newdata = [];
                            newdata.push({_id:i.data._id,
                                x_origin: x0,
                                y_origin: y0,
                                x: newX,
                                y: newY,
                                hidden: false,
                                offsetrotation: newoffsetrotation,
                                radialmotion: "on"
                            });
                            updatelighting(newdata);	
                        }
                        updateposition()
                    }
                    sleep(speed).then(()=> {movelight()});
                }
                if(i.data.radialmotion==="stop"){return} else {movelight()}
            }
        }
    }
    radial_light()
    /**
        Attributions: 
            Created by: @Rantarian
    */