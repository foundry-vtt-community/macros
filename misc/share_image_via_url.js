/**
 * Share an image to all players when you have an image URL
 * Author: @Krishmero#1792
 */

new Dialog({
  title: `Share Image via URL`,
  content: `
    <form>
      <div class="form-group">
        <label for="image-url">Image URL:</label>
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
        if (!imageUrl) {
          return ui.notifications.info("You did not provide a valid image.");
        }
        const ip = new ImagePopout(imageUrl);

        // Display the image popout
        ip.render(true);

        // Share the image with other connected players
        ip.shareImage();
      }
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`
    },
  },
  default: "yes"
}).render(true)
