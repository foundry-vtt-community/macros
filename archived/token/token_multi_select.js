/*
Swap the selected token with another of similar name via a
drop-down menu in a dialog box.

Tokens for each character should be named similarly but end with
'_walking.png', '_fighting.png', and '_sneaking.png'. For example,
'talion_walking.png', 'talion_fighting.png', and 'talion_sneaking.png'

If a token does not exist, mystery man will be automatically selected.
*/

if (actor !== undefined && actor !== null) {
  let d = new Dialog({
    title: 'Token Mogrifier',
    content: "<p>Select a new token</p>" +
      "<select name='token' id='token'>" +
        "<option value='_walking.png'>Walking</option>" +
        "<option value='_fighting.png'>Fighting</option>" +
        "<option value='_sneaking.png'>Sneaking</option>" +
        "<option value='_unconscious.png'>Unconscious</option>" +
      "</select>",
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: "Do it!",
        callback: () =>
          token.document.update({
            img: token.data.img.slice(0, token.data.img.lastIndexOf('_')) + document.getElementById("token").value
          })
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Nevermind",
        callback: () => {}
      }
    }
  });
  d.render(true);
} else {
  ui.notifications.warn("Please select a token.");
}
