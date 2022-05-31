//rolltable by u/DougTheDragonborn from https://www.reddit.com/r/BehindTheTables/comments/fgdrq0/omens_from_dreams_an_all_dice_table/

let setting = [
	`You find yourself on a ship at night with rain pelting your face. `,
	`You find yourself in a seemingly peaceful grove full of flowers. `,
	`You find yourself at the top of a wizard's tower, looking over the ledge. `,
	`You find yourself sitting at a the bar of a familiar inn. `,
	`You find yourself face down in the sand with no structure in sight. `,
	`You find yourself falling from the sky and crashing into a body of water. `,
	`You find yourself on a battlefield lined with dead soldiers and common folk alike. `,
	`You find yourself in a cemetery covering all sides of a city-sized sphere floating in the darkness. `,
	`You find yourself as small as an insect, lost in the grass of a field. `,
	`You find yourself looking down upon your own body, laying where you slept this night. `,
	`You find yourself feasting with loved ones in a grand mansion. `,
	`You find yourself bound to a strangers back as they walk through a swamp. `,
	`You find yourself rising from slumber in the same spot you fell asleep, but you see your body still sleeping; you are a spirit. `,
	`You find yourself losing an arm wrestling contest to a king, and the court laughs and points. `,
	`You find yourself swimming in an endless ocean. `,
	`You find yourself telling a joke to a monarch, and nobody laughs. `,
	`You find yourself furiously running from something chasing you. `,
	`You find yourself aboard a ship far out to sea. `,
	`You find yourself at the gates of eternity; a choir of divine beings float around you as far as you can see. `,
	`You find yourself in the dilapidated temple of a religion you despise. However, a feeling of failure weighs heavy on your mind. `];

let being = [
`A three-headed being looks down upon you from the sky, one face scowling, one crying, and one smiling. `,
`Your deity manifests in front of you after crashing down from the heavens; they are worn from battle. `,
`A serpent slithers toward you, it's body growing longer as it moves as to never leaves an area it once occupied. `,
`A sickly frog uses its broken limbs to move toward you. `,
`A figure made solely of familiar faces stares at you. `,
`The person you care for most walks up behind you and places their hands gently around your neck. `,
`Bones rise and form the skeleton of an unrecognizable creature. `,
`Your skin tears from your muscle, forming a swirl of a face in front of you. `,
`A swarm of maggots overtake your surroundings becoming a being standing 20 feet tall. `,
`A mass of red clouds shroud the sky. A tear allows you to see something approaching from far beyond the stars. `,
`Four versions of you appear, each one from an important moment in your life. `,
`An oval eye nearly as tall as you stares at you, following you wherever you go. `];

let action = [
`The being looks left quickly, and scrambles around before disappearing, but you can faintly make out`,
`It creates a plume of fire; you feel the heat against your face. A vision of what to come:`,
`A pool forms at your feet, swirling with otherworldly power, which glistens with the image of`,
`It calls out your name but its voice fades from existence. Then you see`,
`It tears open, revealing a single word in a language you do not understand along with the image of`,
`You destroy it, but it wails and dies revealing`,
`A wave of teeth and bones wash everything away, and in its wake, you see`,
`It kneels before you, arms stretched out as if waiting to receive something. `,
`Its mouth opens, a haunting chorus of laughter erupting forth; its cackles turn to streams of light which manifest as`,
`It splits the ground open before you, exposing the depths of the world. `];

let omen = [
`your hometown, burning, absolutely orange with smoke and flame. `,
`those you love turning the back on you, shame is clear in their eyes. `,
`a devilish form laughing before being consumed in brimstone. `,
`your eyes pull themselves from your body, moving toward a collection of colors you cannot look away from. `,
`all material items you treasure are taken, destroyed, or dissolve. `,
`a foreign vessel with a crew that have no solid form sinking at an incredible rate. `,
`cracks forming along the sea bed, draining the waters, and then a horde of monstrous limbs climbing out. `,
`a terrible screech and then complete and utter silence. `];

let feeling = [
`You feel a great sense of dread about how real it all felt, but shake it off quickly. `,
`You feel a bit perplexed on why this being came to you of all people. `,
`You feel like this is something you need to tell your party members, but can barely find the words to describe the experience. `,
`You feel like this matter will weigh on you for the days to come. `,
`You feel the matter would be a complete waste of time to investigate. `,
`You feel unsettled at the events that unfolded before you. `];

let waking = [
`You awaken in a cold sweat. `,
`When you awake, you find yourself sleepwalking about 20 feet from where you fell asleep. `,
`When you awaken, you still see the last image of your dream when you shut your eyes until you flush them with water. `,
`You jump up, a scream rising in your throat for a moment, but you are able to silence yourself before anyone notices. `];

function random(arr) {
	return Math.floor(Math.random() * (arr.length))
}

let message = setting[random(setting)]+being[random(being)]+action[random(action)]+omen[random(omen)]+feeling[random(feeling)]+waking[random(waking)];

console.log(message)

 ChatMessage.create({
	user : game.user._id,
	content: message,
	whisper : ChatMessage.getWhisperRecipients("test")
});
