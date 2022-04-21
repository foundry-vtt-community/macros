// Provides a prompt to set default permissions to all items within a folder.
// Prompts the user for the folder name (case sensitive) and the permission level.

const form = `
  <div style="display: inline-block; width: 100px">Folder:</div>
  <input type="string" id="folderName">
  <br />

  <div style="display: inline-block; width: 100px">Folder Type:</div>
  <select id="folderType">
    <option>Actor</option>
    <option>JournalEntry</option>
    <option>Cards</option>
    <option>Item</option>
    <option>Scene</option>
    <option>RollTable</option>
    <option>Playlist</option>
    <option>Macro</option>
  </select>
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
	title: 'Set desired permission',
	content: form,
	buttons: {
		use: {
			label: 'Apply permissions',
			callback: applyPermissions,
		},
	},
}).render(true);

/**
 *
 * @param {jQuery} html
 */
function applyPermissions(html) {
	// Get values from form
	const folderType = html.find('select#folderType')[0].value;
	const folderName = html.find(`input#folderName`)[0].value;
	const permission = html.find(`select#desiredPermission`)[0].value;
	const recurse = html.find(`input#recurse`)[0].checked;

	// Find folderName
	const folders = game.folders.filter(
		f => f.type === folderType && f.name === folderName
	);

	if (folders.length === 0)
		ui.notifications.error(
			`Your world does not have any folders named '${folderName}'.`
		);
	else if (folders.length > 1)
		ui.notifications.error(
			`Your world has more than one folder named ${folderName}`
		);
	else {
		repermission(folders[0], permission, recurse);
		ui.notifications.notify(
			`Desired permissions were set successfully for '${folderName}' of type '${folderType}'.`
		);
	}
}

/**
 *
 * @param {*} currentFolder
 * @param {String} desiredPermission
 * @param {Boolean} recurse
 * @returns {Boolean}
 */
async function repermission(currentFolder, desiredPermission, recurse) {
	console.info(`Repermissioning: ${currentFolder.name}`);

	if (currentFolder.content) {
		currentFolder.content.forEach(async doc => {
			const newPerms = duplicate(doc.data.permission);
			newPerms.default = Number(desiredPermission);
			await doc.update({ permission: newPerms });
		});
	}

	if (recurse && currentFolder.children) {
		currentFolder.children.forEach(folder =>
			repermission(folder, desiredPermission, recurse)
		);
	}
}
