// Provides a prompt to set global permissions to all items within a folder.
// Prompts the user for the folder name (case sensitive) and the permission level.

const form = `
  <div style="display: inline-block; width: 100px">Folder:</div>
  <input type="string" id="folderName">
  <br />

  <div style="display: inline-block; width: 100px">Permission:</div>
  <select id="desiredPermission" />
    <option value="0">None</option>
    <option value="1">Limited</option>
    <option value="2">Observer</option>
    <option value="3">Owner</option>
  </select>
  <br />

  <label>
  	<input type="checkbox" id="recurse" checked/>
    Recurse into subfolders
	</label>
`;

const dialog = new Dialog({
  title: "Set desired permission",
  content: form,
  buttons: {
    use: {
      label: "Apply permissions",
      callback: applyPermissions
    }
  }
}).render(true);

function applyPermissions(html) {
  const folderName = html.find(`input#folderName`)[0].value;
  const permission = html.find(`select#desiredPermission`)[0].value;
  const recurse = html.find(`input#recurse`)[0].checked;
  
  const folders = game.folders.filter(f => f.name === folderName);
  if (folders.length === 0) {
    ui.notifications.error(`Your world does not have any folders named '${folderName}'.`);
  }
  else if(folders.length > 1) {
   ui.notifications.error(`Your world has more than one folder named ${folderName}`) 
  }
  else {
    repermission(folders[0], permission, recurse);
    ui.notifications.notify(`Desired permissions were set successfully for  '${folderName}'.`);
  }
}

function repermission(currentFolder, desiredPermission, recurse) {
  console.debug("Repermissioning: ", currentFolder.name);
  
  if (currentFolder.content) {
    currentFolder.content.map(item => {
      let newPermissions = duplicate(item.data.permission);
      newPermissions.default = desiredPermission;
      console.debug("  Item:", item.data.name);
      item.update({ permission: newPermissions });
    });
  }

  if (currentFolder.children && recurse) {
    currentFolder.children.map(({ data }) => {
      repermission(
        game.folders.entities.filter(f => f.data._id == data._id)[0],
        desiredPermission,
        recurse);
    });
  }
}
