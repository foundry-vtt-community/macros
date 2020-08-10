let dialogEditor = new Dialog({
  title: `Token Light Picker`,
  content: `Pick the light source the selected token is holding.`,
  buttons: {
    none: {
      label: `None`,
      callback: () => {
        token.update({"dimLight": null, "brightLight": null, "lightAngle": 360,});
        dialogEditor.render(true);
      }
    },
    torch: {
      label: `Torch`,
      callback: () => {
        token.update({"dimLight": 40, "brightLight": 20, "lightAngle": 360,});
        dialogEditor.render(true);
      }
    },
    lamp: {
      label: `Lamp`,
      callback: () => {
        token.update({"dimLight": 45, "brightLight": 15, "lightAngle": 360,});
        dialogEditor.render(true);
      }
    },
    bullseye: {
      label: `Bullseye Lantern`,
      callback: () => {
        token.update({"dimLight": 120, "brightLight": 60, "lightAngle": 45,});
        dialogEditor.render(true);
      }
    },
    hoodedOpen: {
      label: `Hooded Lantern (Open)`,
      callback: () => {
        token.update({"dimLight": 60, "brightLight": 30, "lightAngle": 360,});
        dialogEditor.render(true);
      }
    },
    hoodedClosed: {
      label: `Hooded Lantern (Closed)`,
      callback: () => {
        token.update({"dimLight": 5, "brightLight": 0, "lightAngle": 360,});
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
