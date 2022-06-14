const version = 'v1.0';

main();


function main() {
  // Add Vision Type only if the Game Master is using the Macro
  let dialogue_content = `
    <form>
      <div class="form-group">
        <label>Name:</label>
        <select id="light-source" name="light-source">
          <option value="NONE">None</option>
          <option value="ALWAYS">ALWAYS</option>
          <option value="CONTROL">CONTROL</option>
          <option value="HOVER">HOVER</option>
          <option value="OWNER">OWNER</option>
          <option value="OWNER_HOVER">OWNER_HOVER</option>
        </select>
      </div>
    </form>
`;

  let applyChanges = false;
  let dialogButtons = {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply Changes`,
      callback: (html) => {
        changeName(html);
      }
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel Changes`
    }   
  }  
  
  // Main Dialogue    
  new Dialog({
    title: `Token Name - ${version}`,
    content: dialogue_content,
    buttons: dialogButtons,
    default: "yes",
  }).render(true);
}

async function changeName(html) {
  let nameBehavior = html.find('[name="light-source"]')[0].value || "none";
  let nameConst;
  // Update all tokens on the map so that the name shows on hover and the bars always show.
  // Display Modes: ALWAYS, CONTROL, HOVER, NONE, OWNER, OWNER_HOVER

  switch(nameBehavior) {
    case 'NONE':
      nameConst = CONST.TOKEN_DISPLAY_MODES.NONE
      break;
    case 'ALWAYS':
      nameConst = CONST.TOKEN_DISPLAY_MODES.ALWAYS
      break;
    case 'CONTROL':
      nameConst = CONST.TOKEN_DISPLAY_MODES.CONTROL
      break;
    case 'HOVER':
      nameConst = CONST.TOKEN_DISPLAY_MODES.HOVER
      break;
    case 'OWNER':
      nameConst = CONST.TOKEN_DISPLAY_MODES.OWNER
      break;
    case 'OWNER_HOVER':
      nameConst = CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
      break;
    default:
      nameConst = CONST.TOKEN_DISPLAY_MODES.NONE
  }  
  
  const tokens = canvas.tokens.placeables.map(token => {
  return {
    _id: token.id,
    "displayName": nameConst
  };
  });

  canvas.scene.updateEmbeddedDocuments('Token', tokens)
}