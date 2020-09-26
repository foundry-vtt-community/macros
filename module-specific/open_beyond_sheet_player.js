// Here's one for your players if you are using Virtual Tabletop Assets - D&D Beyond Integration:
// Requires https://www.vttassets.com/modules/vtta-dndbeyond with character sheets linked!

let popup = () => {
  if (!game.user.character)
      return ui.notifications.error("You must first have a character assigned to your user!");

  let char = game.user.character;

  if (!char.data.flags.vtta && !char.data.flags.vtta.dndbeyond && !char.data.flags.vtta.dndbeyond.url)
      return ui.notifications.error("Character must be linked with a D&D Beyond sheet!");

  let url = char.data.flags.vtta.dndbeyond.url;
  let ratio = window.innerWidth / window.innerHeight;
  let width = Math.round(window.innerWidth * 0.5);
  let height = Math.round(window.innerWidth * 0.5 * ratio);
  const dndBeyondPopup = window.open(
      url,
      "ddb_sheet_popup",
      `resizeable,scrollbars,location=no,width=${width},height=${height},toolbar=1`
  );
};

popup();