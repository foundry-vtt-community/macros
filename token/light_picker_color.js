function tokenUpdate(data) {
    canvas.tokens.controlled.map(token => token.document.update({ light: data }));
}

const isGM = game.user.isGM;

let color = "#ffffff";
let alpha = 1.0;
let tokens = canvas.tokens.controlled;
if (tokens.length === 1) {
    color = tokens[0].data.light.color ?? color;
    alpha = tokens[0].data.light.alpha ?? alpha;
}

const torchAnimation = {type: "torch", speed: 1, intensity: 1};
const energyShield = {type: "energy", speed: 1, intensity: 1};
const lights = {
    none: {
        label: "None",
        data: {dim: null, bright: null, angle: 360}
    },
    torch: {
        label: "Torch",
        data: {dim: 40, bright: 20, angle: 360, animation: torchAnimation}
    },
    light: {
        label: "Light cantrip",
        data: {dim: 40, bright: 20, angle: 360, animation: {type: "none"}}
    },
    lamp: {
        label: "Lamp",
        data: {dim: 45, bright: 15, angle: 360, animation: torchAnimation}
    },
    shield: {
        label: "Shield",
        data: {dim: 0.5, bright: 0, angle: 360, animation: energyShield}
    },
    bullseye: {
        label: "Bullseye Lantern",
        data: {dim: 120, bright: 60, angle: 45, animation: torchAnimation}
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
                tokenUpdate(Object.assign(data, {color: newColor, alpha: newAlpha}));
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
