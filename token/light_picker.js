function tokenUpdate(data) {
  canvas.tokens.controlled.map(token => token.update(data));
}

let torchAnimation = {"type": "torch", "speed": 1, "intensity": 1};

let dialogEditor = new Dialog({
  title: `Token Light Picker`,
  content: `Pick the light source the selected token is holding.`,
  buttons: {
    none: {
      label: `None`,
      callback: () => {
        tokenUpdate({"dimLight": null, "brightLight": null, "lightAngle": 360,});
        dialogEditor.render(true);
      }
    },
    torch: {
      label: `Torch`,
      callback: () => {
        tokenUpdate({"dimLight": 40, "brightLight": 20, "lightAngle": 360, "lightAnimation": torchAnimation});
        dialogEditor.render(true);
      }
    },
    light: {
      label: `Light cantrip`,
      callback: () => {
        tokenUpdate({"dimLight": 40, "brightLight": 20, "lightAngle": 360, "lightAnimation": {"type": "none"}});
        dialogEditor.render(true);
      }
    },
    lamp: {
      label: `Lamp`,
      callback: () => {
        tokenUpdate({"dimLight": 45, "brightLight": 15, "lightAngle": 360, "lightAnimation": torchAnimation});
        dialogEditor.render(true);
      }
    },
    bullseye: {
      label: `Bullseye Lantern`,
      callback: () => {
        tokenUpdate({"dimLight": 120, "brightLight": 60, "lightAngle": 45, "lightAnimation": torchAnimation});
        dialogEditor.render(true);
      }
    },
    hoodedOpen: {
      label: `Hooded Lantern (Open)`,
      callback: () => {
        tokenUpdate({"dimLight": 60, "brightLight": 30, "lightAngle": 360, "lightAnimation": torchAnimation});
        dialogEditor.render(true);
      }
    },
    hoodedClosed: {
      label: `Hooded Lantern (Closed)`,
      callback: () => {
        tokenUpdate({"dimLight": 5, "brightLight": 0, "lightAngle": 360, "lightAnimation": torchAnimation});
        dialogEditor.render(true);
      }
    },
    close: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Close`
    },
  },
  default: "close",
  close: () => {}
});

dialogEditor.render(true)
