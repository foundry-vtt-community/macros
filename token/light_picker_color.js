function tokenUpdate(data) {
    canvas.tokens.controlled.map(token => token.update(data));
}

const isGM = game.user.isGM;

let color = "#ffffff";
let alpha = 1.0;
let tokens = canvas.tokens.controlled;
if (tokens.length === 1) {
    color = tokens[0].data.lightColor;
    alpha = tokens[0].data.lightAlpha;
}

const torchAnimation = {type: "torch", speed: 1, intensity: 1};
const energyShield = {type: "energy", speed: 1, intensity: 1};
const lights = {
    none: {
        label: "None",
        data: {dimLight: null, brightLight: null, lightAngle: 360}
    },
    torch: {
        label: "Torch",
        data: {dimLight: 40, brightLight: 20, lightAngle: 360, lightAnimation: torchAnimation}
    },
    light: {
        label: "Light cantrip",
        data: {dimLight: 40, brightLight: 20, lightAngle: 360, lightAnimation: {type: "none"}}
    },
    lamp: {
        label: "Lamp",
        data: {dimLight: 45, brightLight: 15, lightAngle: 360, lightAnimation: torchAnimation}
    },
    shield: {
        label: "Shield",
        data: {dimLight: 0.5, brightLight: 0, lightAngle: 360, lightAnimation: energyShield}
    },
    bullseye: {
        label: "Bullseye Lantern",
        data: {dimLight: 120, brightLight: 60, lightAngle: 45, lightAnimation: torchAnimation}
    }
};

function getLights() {
    let lightButtons = {};
    Object.entries(lights).forEach(([key, light]) => {
        lightButtons[key] = {
            label: light.label,
            callback: (html) => {
                const newColor = html.find("#color").val();
                const newAlpha = Number(html.find("#alpha").val());
                var data = light.data;
                tokenUpdate(Object.assign(data, {lightColor: newColor, lightAlpha: newAlpha}));
            }
        }
    });

    lightButtons = Object.assign(lightButtons, {
        close: {
            icon: "<i class='fas fa-tick'></i>",
            label: `Close`
        }
    });

    return lightButtons;
}

new Dialog({
    title: `Token Light Picker`,
    content: `
        <form>
            <div style="display: flex; align-content: center;">
            <label for="color" style="line-height: 25px;">Color:</label>
            <input type="color" value="${color}" id="color" style="margin-left: 10px;">
            ${isGM ? '<label for="alpha" style="line-height: 25px;">Intensity:</label>' : ''}
            <input type="${isGM ? 'range' : 'hidden'}" value="${alpha}" id="alpha" style="margin-left: 10px;" min="0.0" max="1.0" step="0.05">
            </div>
        </form>`,
    buttons: getLights(),
    default: "close",
    close: () => {}
}).render(true);
