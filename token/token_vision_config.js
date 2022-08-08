// A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings. 

let applyChanges = false;
new Dialog({
  title: `Token Vision Configuration`,
  content: `
    <form>
      <div class="form-group">
        <label>Vision Type:</label>
        <select id="vision-type" name="vision-type">
          <option value="nochange">No Change</option>
          <option value="dim0">Self</option>
          <option value="dim30">Darkvision (30 ft)</option>
          <option value="dim60">Darkvision (60 ft)</option>
          <option value="dim90">Darkvision (90 ft)</option>
          <option value="dim120">Darkvision (120 ft)</option>
          <option value="dim150">Darkvision (150 ft)</option>
          <option value="dim180">Darkvision (180 ft)</option>
          <option value="bright120">Devil's Sight (Warlock)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Light Source:</label>
        <select id="light-source" name="light-source">
          <option value="nochange">No Change</option>
          <option value="none">None</option>
          <option value="candle">Candle</option>
          <option value="lamp">Lamp</option>
          <option value="bullseye">Lantern (Bullseye)</option>
          <option value="hooded-dim">Lantern (Hooded - Dim)</option>
          <option value="hooded-bright">Lantern (Hooded - Bright)</option>
          <option value="light">Light (Cantrip)</option>
          <option value="torch">Torch</option>
          <option value="moon-touched">Moon-Touched</option>
        </select>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Changes`,
      callback: () => applyChanges = true
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel Changes`
    },
  },
  default: "yes",
  close: html => {
    if (applyChanges) {
      let updates = [];
      for ( let token of canvas.tokens.controlled ) {
        let visionType = html.find('[name="vision-type"]')[0].value || "none";
        let lightSource = html.find('[name="light-source"]')[0].value || "none";
        let dimSight = 0;
        let brightSight = 0;
        let dimLight = 0;
        let brightLight = 0;
        let lightAngle = 360;
        let lockRotation = token.data.lockRotation;
        let lightAnimation = token.data.light.animation;
        let lightAlpha = token.data.light.alpha;
        let lightColor = token.data.light.color;
        const colorFire = "#f8c377";
        const colorWhite = "#ffffff";
        const colorMoonGlow = "#f4f1c9";
        // Get Vision Type Values
        switch (visionType) {
          case "dim0":
            dimSight = 0;
            brightSight = 0;
            break;
          case "dim30":
            dimSight = 30;
            brightSight = 0;
            break;
          case "dim60":
            dimSight = 60;
            brightSight = 0;
            break;
          case "dim90":
            dimSight = 90;
            brightSight = 0;
            break;
          case "dim120":
            dimSight = 120;
            brightSight = 0;
            break;
          case "dim150":
            dimSight = 150;
            brightSight = 0;
            break;
          case "dim180":
            dimSight = 180;
            brightSight = 0;
            break;
          case "bright120":
            dimSight = 0;
            brightSight= 120;
            break;
          case "nochange":
          default:
            dimSight = token.data.dimSight;
            brightSight = token.data.brightSight;
        }
        // Get Light Source Values
        switch (lightSource) {
          case "none":
            dimLight = 0;
            brightLight = 0;
            lightAnimation = {type: "none"};
            break;
          case "candle":
            dimLight = 10;
            brightLight = 5;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "lamp":
            dimLight = 45;
            brightLight = 15;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "bullseye":
            dimLight = 120;
            brightLight = 60;
            lockRotation = false;
            lightAngle = 52.5;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "hooded-dim":
            dimLight = 5;
            brightLight = 0;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "hooded-bright":
            dimLight = 60;
            brightLight = 30;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "light":
            dimLight = 40;
            brightLight = 20;
            lightAnimation = {type: "none"};
            lightColor = colorWhite;
            lightAlpha = 0.15;
            break;
          case "torch":
            dimLight = 40;
            brightLight = 20;
            lightAnimation = {type: "torch", speed: 2, intensity: 2};
            lightColor = colorFire;
            lightAlpha = 0.15;
            break;
          case "moon-touched":
            dimLight = 30;
            brightLight = 15;
            lightAnimation = {type: "none"};
            lightColor = colorMoonGlow;
            break;
          case "nochange":
          default:
            dimLight = token.data.light.dim;
            brightLight = token.data.light.bright;
            lightAngle = token.data.light.angle;
            lockRotation = token.data.lockRotation;
            lightAnimation = token.data.light.animation;
            lightAlpha = token.data.light.alpha;
            lightColor = token.data.light.color;
        }
        // Update Token
        updates.push({
          _id: token.id,
          vision: true,
          dimSight: dimSight,
          brightSight: brightSight,
          "light.dim": dimLight,
          "light.bright":  brightLight,
          "light.angle": lightAngle,
          lockRotation: lockRotation,
          "light.animation": lightAnimation,
          "light.alpha": lightAlpha,
          "light.color": lightColor
        });
      }
      canvas.scene.updateEmbeddedDocuments("Token", updates);
    }
  }
}).render(true);
