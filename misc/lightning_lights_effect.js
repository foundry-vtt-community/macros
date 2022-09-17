//Macro made on FoundryVTT version 9 build 269. No module or system dependencies.
//this Macro allows you to specify light sources to flash at random intervals with a random flash count. You generally won't want to have more than one instance of this running at a time. The macro will automatically terminate when it tries to run while another scene is active.
//EPILEPSY WARNING: This macro may potentially trigger seizures for people with photosensitive epilepsy. User discretion is advised.

/** 
	Control Section 
*/
/*This control will limit the scene to have only one instance. Set to false if you want to deploy the macro separately on different lights, but be mindful that this will substantially increase the flashing effect.*/
let scenelimit = true; 

/* Enter the IDs of light sources in the below array. You can get these by opening the properties of the light and looking in the window's title bar. If scenelimit is false, avoid adding more than one lightning effect to the same light as flashing increases a lot.*/
let targetlightid = [
"lightid_1",
"lightid_2",
"lightid_3"
]
/* flashspeed sets the base length of time a light stays on, and the time between flashes in the same event. A value between 50 and 75 gives the most realistic results. */
let flashspeed = 50;
							
/* max_flash_count can have values between 1 and 4, however is set to 3 as a default due to epilepsy concerns. This limit falls in line with guidance from epilepsy.com. */
let max_flash_count = 3;

/* It is possible to add thunder effects. Set this to false to disable them. */
let add_thunder = true;

/*Setting the thunder_distance sets a delay on the thunder and modifies the thunder_volume value if it is set to "auto"*/
let thunder_distance = "close"; 	//acceptable values: close, near, far, distant. 

/*The thunder_volume value accepts values between 0.1 and 1, or "auto". When "auto" is supplied, it has a base value of 0.5 and will decrease based on the thunder_distance value.*/
let thunder_volume = "auto";

/*The thunder_sound_array is a list of thunder sound effects you want to use. It needs at least one, but there's no upper limit.*/
let thunder_sound_array = [ 
	"/path/soundfile1.wav",
	"/path/soundfile2.wav",
	"/path/soundfile3.wav"
]

let thunder_delay; //this is here to declare the variable. Don't change it.

/*The below settings can be reconfigured if you want to change the volume based on thunder_distance, provided thunder_volume is set to "auto"*/
if(thunder_volume === "auto") {
	switch(thunder_distance) {
		case "close":
			thunder_volume = 0.5;
			break;
		case "near":
			thunder_volume = 0.4;
			break;
		case "far":
			thunder_volume = 0.3;
			break;
		case "distant":
			thunder_volume = 0.2;
			break;
		default:
			thunder_volume = 0.5
			break;
	}
}

/*The below settings can be reconfigured if you want to change the delay based on thunder_distance.*/
switch(thunder_distance) {
	case "close":
		break;
	case "near":
		thunder_delay = 1;
		break;
	case "far":
		thunder_delay = 3;
		break;
	case "distant":
		thunder_delay = 5;
		break;
	default:
		thunder_delay = 0;
		break;
}


/** 
	End Control Section 
*/
/** 
	The below is pure code controlled by the above settings. There is no need to change it. 
*/
if(scenelimit && canvas.scene.data.lightning) {
	console.log("lightning already active");
	return
} else {
	canvas.scene.data.lightning = true
}
let scene = game.scenes.active;
let scenelights = canvas.lighting.placeables;
async function updatelighting(newdata) {
	await scene.updateEmbeddedDocuments("AmbientLight", newdata);
}
function lightning() {
	let flashnumber = Math.ceil(Math.random()*max_flash_count,0);
	function flashinterval() {
		return Math.ceil(Math.random()*5,0)*flashspeed;
	}
	let flashon_1 = 0;
	let flashoff_1 = flashinterval();
	let flashon_2 = flashoff_1+flashinterval();
	let flashoff_2 = flashon_2+flashinterval();
	let flashon_3 = flashoff_2+flashinterval();
	let flashoff_3 = flashon_3+flashinterval();
	let flashon_4 = flashoff_3+flashinterval();
	let flashoff_4 = flashon_4+flashinterval();
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	function flashdelay() {
		return (Math.ceil(Math.random()*20,0)+4)*1000;
	}
	for (let i of scenelights) {
		let targetlights = [];
		canvas.lighting.placeables.forEach(l => { if (targetlightid.includes(l.id) && l.scene === scene) targetlights.push(l.id) })
		if(targetlightid.includes(i.data._id)) {
			function lighton(){
				i.data.hidden = false;
				newdata = [];
				newdata.push({_id:i.data._id,
					hidden:false
				});
				updatelighting(newdata);		
			}
			function lightoff(){
				i.data.hidden = true;
				newdata = [];
				newdata.push({_id:i.data._id,
					hidden:true
				});
				updatelighting(newdata);	
			}		
			function lightningflash(flashcount,on_1,off_1,on_2,off_2,on_3,off_3,on_4,off_4) {				
				sleep(on_1).then(()=> {lighton()});
				sleep(off_1).then(()=> {lightoff()});
				
				if(flashcount>=2) {
					sleep(on_2).then(()=> {lighton()});
					sleep(off_2).then(()=> {lightoff()});
				}
				if(flashcount>=3) {
					sleep(on_3).then(()=> {lighton()});
					sleep(off_3).then(()=> {lightoff()});
				}
				if(flashcount=4) {
					sleep(on_4).then(()=> {lighton()});
					sleep(off_4).then(()=> {lightoff()});
				}
				
			}
			function lightningburst() {
					lightningflash(flashnumber,flashon_1,flashoff_1,flashon_2,flashoff_2,flashon_3,flashoff_3,flashon_4,flashoff_4);
				}
			lightningburst()
			sleep(2000).then(()=> {lightoff()});
		}
	}
	if(add_thunder){
		let vol;
		if(scene === game.scenes.current) {
vol = thunder_volume} else {vol = 0}
		let playfile = thunder_sound_array[Math.floor(Math.random()*thunder_sound_array.length,0)];
		sleep(thunder_delay*1000).then(()=> {AudioHelper.play({src: playfile, volume: vol, autoplay: true, loop: false}, true);});
	}
	sleep(flashdelay()).then(()=> {lightning()});
}
lightning()

/**
	Attributions: 
		Created by: @Rantarian
*/