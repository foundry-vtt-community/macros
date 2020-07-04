/**
Author: @stan#1549 (github.com/janssen-io)

Description:
The first time you click the macro, it will prompt you for your screen size (diagonal).
Clicking the macro a second time will automatically scale to 1"/grid unit (square/hex).
Shift-click the macro to update this value.

Note:
The screen size is saved per client. So opening the macro on another device for the first time, will make it prompt for the screen size again.
 */

function showDialog(inches, resolve) {
  new Dialog({
    content: `Screen size (inches): <input type="number" min="10" max="200" value="${inches}" />`,
    default: 'scale',
    buttons: {
      scale: {
        label: 'Scale',
        callback: html => resolve(+html.find('input').val())
      }
    }
  }).render(true);
}

function scale(screenSizeInches) {
  const diagonal = Math.sqrt(screen.width ** 2 + screen.height ** 2);
  const ppi = diagonal / screenSizeInches;
  console.log(`PPI: ${screenSizeInches}" screen | ${canvas.grid.size}px per grid unit | ${ppi}px per inch | Scaling to: ${ppi / canvas.grid.size}`);
  canvas.animatePan({ scale: ppi / canvas.grid.size });
}

const key = 'stan#1549.scale.screenSize';
const storedScreenSize = localStorage.getItem(key);
const shouldUpdatePPI = !storedScreenSize || event.shiftKey;

const getScreenSize = new Promise(resolve => {
  if (shouldUpdatePPI) {
    showDialog(storedScreenSize || 42, resolve);
  } else {
    resolve(storedScreenSize);
  }
});

getScreenSize.then(inches => {
  scale(inches);
  localStorage.setItem(key, inches);
});


