// Adds the actor's AC to the combat tracker. Then toggles between HP and AC
const a = "attributes.ac.value";
const b = "attributes.hp.value";

if (game.combat.settings.resource == a) {
  game.settings.set('core', 'combatTrackerConfig', {resource: b, skipDefeated: true});
} else {
  game.settings.set('core', 'combatTrackerConfig', {resource: a, skipDefeated: true});
}
game.combat.update({active: true}, {diff: false});
