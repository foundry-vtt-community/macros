let macroName = "AmbientLight QuickEditor"
let macroEndLog = "---------------------------------------------"

let i=0;
let lights = canvas.lighting.objects.children;
let lightSelected = lights[0];
let selectOptions = "";
let lightSelectedAngle = 0;
let lightSelectedBright = 0;
let lightSelectedDim = 0;
let lightSelectedRotation = 0;
let lightSelectedTintAlpha = 1;
let lightSelectedTintColor = "";

console.log("---------------------------------------------");
console.log(`${macroName} by PaperPunk`);
console.log("---------------------------------------------");
console.log(`${macroName} | Start`);

const drawingDetails = {
      author: game.userId,
      fillAlpha: 0,
      fillColor: "#808080",
      fillType: 1,
      fontFamily: "FontAwesome",
      fontSize: 24,
      height: 48,
      hidden: false,
      locked: false,
      rotation: 0,
      strokeAlpha: 1,
      strokeColor: "#000000",
      strokeWidth: 2,
      text: i,
      textAlpha: 1,
      textColor: "#ffffff",
      type: "r",
      width: 48,
      //x: 250,
      x: lightSelected.x-24,
      //y: 250
      y: lightSelected.y+25
};

//let d = Drawing.create(drawingDetails);
//d.update({"x": lights[i].x-24, "y": lights[i].y+25, "text": i});

for (i= 0; i< lights.length; i++) {
 selectOptions += `<option value="${i}">AmbientLight ${i}</option>`;
}

const htmlLightSelection = `
    <form>
      <h2>Select your light.</h2>
      <div class="form-group">
        <label>Light:</label>
        <select id="light-selector" name="light-selector">
          ${selectOptions}
        </select>
      </div>
    </form>
    `;

let dialogSelector = new Dialog({
  title: `${macroName}`,
  content: htmlLightSelection,
  buttons: {
    confirm: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Confirm`,
      callback: htmlLightSelection => { 
        lightSelected = (htmlLightSelection.find('[name="light-selector"]')[0].value)
        lightSelectedAngle = lights[lightSelected].data.config.angle;
        lightSelectedBright = lights[lightSelected].data.config.bright;
        lightSelectedDim = lights[lightSelected].data.config.dim;
        lightSelectedRotation = lights[lightSelected].data.rotation;
        lightSelectedTintAlpha = lights[lightSelected].data.config.alpha;
        lightSelectedTintColor = lights[lightSelected].data.config.color;
        //console.log(`${macroName} | lightSelected = ${lightSelected}`);
        //console.log(`${macroName} | lightSelectedBright = ${lightSelectedBright}`);
        dialogEditor.render(true);
      }
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`,
      callback: () => {
        console.log(`${macroName} | Goodbye`);
        console.log(macroEndLog);
      }
    },
  },
  default: "cancel",
  //close: () => console.log("AmbientLight QuickEditor | Dialog Window Closed")
});

let dialogEditor = new Dialog({
  title: `${macroName}`,
  content: `<h2>Edit your light.</h2>
      <p>Emission Angle: ${lightSelectedAngle}</p>
      <p>Bright light distance: ${lightSelectedBright}</p>
      <p>Dim light distance: ${lightSelectedDim}</p>
      <p>Rotation CW from down: ${lightSelectedRotation}</p>
      <p>Tint Alpha: ${lightSelectedAngle}</p>
      <p>Tint Color HexCode: ${lightSelectedAngle}</p>`,
  buttons: {
    rot5cw: {
      icon: "<i class='fas fa-redo'></i>",
      label: `Rotate 5* CW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot+5});
        dialogEditor.render(true);
      }
    },
    rot15cw: {
      icon: "<i class='fas fa-redo'></i>",
      label: `Rotate 15* CW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot+15});
        dialogEditor.render(true);
      }
    },
    rot45cw: {
      icon: "<i class='fas fa-redo'></i>",
      label: `Rotate 45* CW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot+45});
        dialogEditor.render(true);
      }
    },
    rot5ccw: {
      icon: "<i class='fas fa-undo'></i>",
      label: `Rotate 5* CCW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot-5});
        dialogEditor.render(true);
      }
    },
    rot15ccw: {
      icon: "<i class='fas fa-undo'></i>",
      label: `Rotate 15* CCW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot-15});
        dialogEditor.render(true);
      }
    },
    rot45ccw: {
      icon: "<i class='fas fa-undo'></i>",
      label: `Rotate 45* CCW`,
      callback: () => { 
        let rot = lights[lightSelected].data.rotation;
        lights[lightSelected].document.update({"rotation":rot-45});
        dialogEditor.render(true);
      }
    },
    brightup: {
      icon: "<i class='fas fa-circle'></i>",
      label: `Increase Bright by 5`,
      callback: () => { 
        let bright = lights[lightSelected].data.config.bright;
        lights[lightSelected].document.update({"config.bright":bright+5});
        dialogEditor.render(true);
      }
    },
    brightdown: {
      icon: "<i class='fas fa-circle'></i>",
      label: `Decrease Bright by 5`,
      callback: () => { 
        let bright = lights[lightSelected].data.config.bright;
        lights[lightSelected].document.update({"bright":bright-5});
        dialogEditor.render(true);
      }
    },
    brightoff: {
      icon: "<i class='fas fa-circle'></i>",
      label: `Remove Bright Light`,
      callback: () => { 
        lights[lightSelected].document.update({"config.bright":0});
        dialogEditor.render(true);
      }
    },
    dimup: {
      icon: "<i class='fas fa-dot-circle'></i>",
      label: `Increase Dim by 5`,
      callback: () => { 
        let dim = lights[lightSelected].data.config.dim;
        lights[lightSelected].document.update({"config.dim":dim+5});
        dialogEditor.render(true);
      }
    },
    dimdown: {
      icon: "<i class='fas fa-dot-circle'></i>",
      label: `Decrease Dim by 5`,
      callback: () => { 
        let dim = lights[lightSelected].data.config.dim;
        lights[lightSelected].document.update({"config.dim":dim-5});
        dialogEditor.render(true);
      }
    },
    dimoff: {
      icon: "<i class='fas fa-dot-circle'></i>",
      label: `Remove Dim Light`,
      callback: () => { 
        lights[lightSelected].document.update({"config.dim":0});
        dialogEditor.render(true);
      }
    },
    emit15: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 15*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":15});
        dialogEditor.render(true);
      }
    },
    emit45: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 45*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":45});
        dialogEditor.render(true);
      }
    },
    emit90: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 90*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":90});
        dialogEditor.render(true);
      }
    },
    emit180: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 180*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":180});
        dialogEditor.render(true);
      }
    },
    emit270: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 270*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":270});
        dialogEditor.render(true);
      }
    },
    emit360: {
      icon: "<i class='fas fa-rss'></i>",
      label: `Emission Angle 360*`,
      callback: () => { 
        lights[lightSelected].document.update({"config.angle":360});
        dialogEditor.render(true);
      }
    },
    back: {
      icon: "<i class='fas fa-reply'></i>",
      label: `Back`,
      callback: () => dialogSelector.render(true)
    },
    close: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Close`
    },
  },
  default: "close",
  close: () => {
    console.log(`${macroName} | Goodbye`);
    console.log(macroEndLog);
  }
});

dialogSelector.render(true);
