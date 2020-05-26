var folderName = "Test Deeper";
var desiredPermission = 0; // 0=None, 1=Limited, 2=Observer, 3=Owner
var applyInSubfolders = true;

/*****
WARNING: This will overwrite the permissions of the items in the folder <folderName>!
         That is, it will not keep the player permissions!
         
         Tested on FoundryVTT 0.5.5 & 0.5.7
       
* * * * * * * * * * * * * * * * * * * * * *
       
WARNING: Make sure the folder name is unique across actors, scenes, items, journals and roll tables!
         This script will apply the desired permission on the first folder it finds with that name.
******/

function repermission(currentFolder) {
  console.log("Repermissioning: ", currentFolder.name);

  if (currentFolder.content){
    currentFolder.content.map(item => {
      let newPermissions = duplicate(item.data.permission);
      newPermissions.default = desiredPermission;
      console.log("  Item:", item.data.name);
      item.update({permission: newPermissions});
    });
  }
  
  if (currentFolder.children && applyInSubfolders) {
    currentFolder.children.map(({data}) => {
      repermission(game.folders.entities.filter(f => f.data._id == data._id)[0]);
    });
  }
}

function findFolder(parent) {
  if (parent.data.name === folderName) {
    return parent;
  }
  
  for (let child of parent.children) {
    let foundFolder = findFolder(child);
    if (foundFolder) {
      return foundFolder;
    }
  }
  
  return null;
}

if (game.folders.entities.length == 0) {
	console.error("Your world does not have any folders.");
}

var root = { data: {}, children: game.folders.entities };

var folder = findFolder(root);
if (!folder) {
  console.error(`Your world does not have any folders named '${folderName}'.`);
}
else {
  repermission(folder);
  console.log("Repermissioning finished successfully!");
}