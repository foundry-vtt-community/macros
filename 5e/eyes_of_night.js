// A macro for applying or removing the Eyes of Night buff for a Twilight Domain Cleric
// Several actors can be selected if desired
async function main(){ 
  let updates = [];
  let iconPath = "icons/magic/perception/silhouette-stealth-shadow.webp";
  for ( let token of canvas.tokens.controlled ) {
    // Eyes of Night buff value
    let dimSight = 300;
    if (token.document.sight.range == token.document._actor.system.attributes.senses.darkvision && token.document._actor.system.attributes.senses.darkvision != 300) {
      // Update Token
      updates.push({
        _id: token.id,
        vision: true,
        dimSight: dimSight,
      });
      await token.toggleEffect(iconPath)
    } else {
      // Remove buff and icon
      updates.push({
        _id: token.id,
        vision: true,
        dimSight: token.document._actor.system.attributes.senses.darkvision,
      });
      await token.toggleEffect(iconPath)
    }
  }
  canvas.scene.updateEmbeddedDocuments("Token", updates);
}

main()