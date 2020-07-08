/**
 * Macro showing Character's Artwork for selected token
 *
 * @author Forien#2130
 * @url https://patreon.com/forien
 * @licence MIT
 */

if (token === undefined) {
  ui.notifications.warn("Please select token first.");
} else {
  let tActor = token.actor;
  let ip = new ImagePopout(tActor.data.img, {
    title: tActor.name,
    shareable: true,
    uuid: tActor.uuid
  }).render(true);
  ip.shareImage();
}
