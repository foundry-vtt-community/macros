/**
 * Share an image to all when you have an image URL.
 * GMs can share to a popup, chat or both.
 * Players can only share to chat.
 * Author: @Krishmero#1792
 */

let imagePopup = (imageUrl) => {
  // Display the image popout and share it.
  const ip = new ImagePopout(imageUrl);
  ip.render(true);
  ip.shareImage();
};

let chatDialog = (imageUrl) => {
	ChatMessage.create({
    user: game.user._id,
    content: `<img src="${imageUrl}" />`,
    type: CONST.CHAT_MESSAGE_TYPES.OOC
  });
};

let selectOptions = game.user.isGM ? `
<label for="output-options" style="margin-right: 10px">Output Options:</label>
<select id="output-options" />
  <option value="popup">Popup</option>
  <option value="chat">Chat</option>
  <option value="both">Both</option>
</select>
` : null

new Dialog({
  title: `Share Image via URL`,
  content: `
    <form>
      <div style="display: inline-block; width: 100%; margin-bottom: 10px">${selectOptions}</div>
      <br />
      <div style="display: flex; width: 100%; margin-bottom: 10px">
      	<label for="image-url" style="white-space: nowrap; margin-right: 10px; padding-top:4px">Image URL:</label>
      	<input type="text" id="image-url" name="image-url" />
    	</div>
    </form>
  `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Share`,
      callback: (html) => {
				let imageUrl = html.find('#image-url').val();
				let permission = html.find('select#output-options')[0].value;
			  if (!imageUrl) {
			    return ui.notifications.info("You did not provide a valid image.");
			  }
        if (game.user.isGM && ['popup', 'both'].includes(permission)) {
        	imagePopup(imageUrl);
        }
        if (!game.user.isGM || ['chat', 'both'].includes(permission)) {
        	chatDialog(imageUrl);
        }
      }
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`
    },
  },
  default: "yes"
}).render(true)
