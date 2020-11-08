// A macro for the Foundry virtual tabletop that lets a user configure their token's vision and lighting settings, based on lighting sources from D&D 5e. Has a dependency on About Time by Tim Posney.

if (canvas.tokens.controlled.length === 0)
  ui.notifications.error("Please select a token");

let namedfields = (...fields) => {
  return (...arr) => {
    var obj = {};
    fields.forEach((field, index) => {
      obj[field] = arr[index];
    });
    return obj;
  };
};

// Very ugly automated construction below. DRY, but at what cost?
let VisionType = namedfields('name', 'dim', 'bright');
var visions = (() => {
  return [
    VisionType('Leave Unchanged', null, null),
    VisionType('Self', 5, 0),
    VisionType('Devil\'s Sight', 0, 120)
  ].concat(...[...Array(6).keys()].map(x => (x+1)*30).map(n => {
    return VisionType(`Darkvision (${n} feet)`, n, 0);
  }));
})();

let LightSource = namedfields('name', 'dim', 'bright', 'angle', 'lockRotation')
var lightSources = [
  LightSource('Leave Unchanged', null, null, null, null),
  LightSource('None', 0, 0, 360, null),
  LightSource('Candle', 10, 5, 360, null),
  LightSource('Torch / Light Cantrip', 40, 20, 360, null),
  LightSource('Lamp', 45, 15, 360, null),
  LightSource('Hooded Lantern', 60, 30, 360, null),
  LightSource('Hooded Lantern (Dim)', 5, 0, 360, null),
  LightSource('Bullseye Lantern', 120, 60, 52.5, false)
];

let applyChanges = false;
new Dialog({
  title: `Token Vision Configuration`,
  content: `
<form>
  <div class="form-group">
    <label>Vision Type:</label>
    <select id="vision-type" name="vision-type">
      ${
        visions.map((vision, index) => {
          return `\t<option value=${index}>${vision.name}</option>`;
        }).join('\n')
      }
    </select>
  </div>
  <div class="form-group">
    <label>Light Source:</label>
    <select id="light-source" name="light-source">
      ${
        lightSources.map((lightSource, index) => {
          return `\t<option value=${index}>${lightSource.name}</option>`;
        }).join('\n')
      }
    </select>
  </div>
  <div class="form-group">
    <label>Duration in Minutes:</label>
    <input type="number" id="duration" name="duration" min="0">
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
      for ( let token of canvas.tokens.controlled ) {
        let visionIndex = parseInt(html.find('[name="vision-type"]')[0].value) || 0;
        let lightIndex = parseInt(html.find('[name="light-source"]')[0].value) || 0;
        let duration = parseInt(html.find('[name="duration"]')[0].value) || 0;

        if (duration > 0) {
          if (game.modules.get("about-time").active != true) {
            ui.notifications.error("About Time isn't loaded");
          } else {
            ((backup) => {
              game.Gametime.doIn({minutes:Math.floor(3 * duration / 4)}, () => {
                ChatMessage.create({
                  user: game.user._id,
                  content: "The fire burns low...",
                  speaker: speaker
                }, {});
              });
            })(Object.assign({}, token.data));
            ((backup) => {
              game.Gametime.doIn({minutes:duration}, () => {
                ChatMessage.create({
                  user: game.user._id,
                  content: "The fire goes out, leaving you in darkness.",
                  speaker: speaker
                }, {});
                token.update({
                  vision: true,
                  dimSight: backup.dimSight,
                  brightSight: backup.brightSight,
                  dimLight: backup.dimLight,
                  brightLight:  backup.brightLight,
                  lightAngle: backup.lightAngle,
                  lockRotation: backup.lockRotation
                });
              });
            })(Object.assign({}, token.data));
          }
        }

        // Configure new token vision
        let dimSight = visions[visionIndex].dim ?? token.data.dimSight;
        let brightSight = visions[visionIndex].bright ?? token.data.brightSight;
        let dimLight = lightSources[lightIndex].dim ?? token.data.dimLight;
        let brightLight = lightSources[lightIndex].bright ?? token.data.brightLight;
        let lightAngle = lightSources[lightIndex].angle ?? token.data.lightAngle;
        let lockRotation = lightSources[lightIndex].lockRotation ?? token.data.lockRotation;
        // Common settings for all 'torch-like' options
        // Feel free to change the values to your liking
        let lightAnimation = {type: "torch", speed: 2, intensity: 2};
        let lightColor = "#f8c377"; // Fire coloring.
        let lightAlpha = 0.15;

        // Update Token
        console.log(token);
        token.update({
          vision: true,
          dimSight: dimSight,
          brightSight: brightSight,
          dimLight: dimLight,
          brightLight:  brightLight,
          lightAngle: lightAngle,
          lockRotation: lockRotation,
          lightAnimation: lightAnimation,
          lightColor: lightColor,
          lightAlpha: lightAlpha
        });
      }
    }
  }
}).render(true);
