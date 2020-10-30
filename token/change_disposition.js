let applyChanges = false;
new Dialog({
  title: `Token Disposition Changer`,
  content: `
    <form>
      <div class="form-group">
        <label>Disposition Type:</label>
        <select id="dispo-type" name="dispo-type">
          <option value="nochange">No Change</option>
          <option value="hostile">Hostile</option>
          <option value="neutral">Neutral</option>
          <option value="friendly">Friendly</option>
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
      for ( let token of canvas.tokens.controlled ) {
        let dispoType = html.find('[name="dispo-type"]')[0].value || "none";
        switch (dispoType) {
          case "hostile":
            token.update({"disposition": -1});
            break;
          case "friendly":
            token.update({"disposition": 1});
            break;
          case "neutral":
            token.update({"disposition": 0});
            break;
          case "nochange":
          default:
        }
      }
    }
  }
}).render(true);
