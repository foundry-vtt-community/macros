///////////////////////////////////////////////////////
//////////////////// CREATED BY ///////////////////////
///////////////////////////////////////////////////////
// This macro was created by u/shuggaloaf.
// https://github.com/Shuggaloaf/NPC-to-Coin-Pile
// FOR A FULL DESCRIPTION -INCLUDING EXAMPLE GIFS-
// GO TO THE LINK ABOVE
//
// Images linked below created using game-icons.net 
// and may not be used for any commerical purposes. 
//
// Enjoy! 
///////////////////////////////////////////////////////


///////////////////////////////////////////////////////
//////////////////// MACRO SYNOPSIS ///////////////////
///////////////////////////////////////////////////////
//   
//  Checks to make sure each selected token is an NPC
//  and if so rolls separately for each token to:
//     - determine random coinage (if any), 
//     - adds that coin to the token,
//     - turns token into an Item Pile
//     - Adds a special effect to the token
//          (if you desire)
///////////////////////////////////////////////////////


/////////////////////////////////////////////////////
//////////////////// USER OPTIONS ///////////////////
/////////////////////////////////////////////////////
//
//   You can have a Light Effect, an Image Change
//   or Both or Neither.    
//   You may also use this with our without the module 
//   Item Piles. 
//
// ITEM PILES INTEGRATION
//   If you have the Item Piles module, this macro 
//   can automatically make all selected tokens 
//   player-lootable.  
//   
//  To TURN OFF integration change the option on the 
//  line below to 0

   let hasItemPiles = 1;  

// change the 1 above to a 0 if you do not have Item 
// Piles, or do not want to use integration. 

                                                          
// IMAGE CHANGE                                           
//   Changes the token image. For example you could 
//   use a chest or a loot sack. 
//
//   I cannot provide the image I personally use as
//   it is commercial... 
//   However I made you a few free ones! Nothing fancy,
//   but they're available here if you want: 
//    https://github.com/Shuggaloaf/NPC-to-Item-Pile/tree/main/img
//
//   If you use your own image and the lighting effect
//   option keep in mind that image coloring can affect
//   the intensity of the light effect
//
//   Whichever image you choose to use, since I do not
//   know that path where you will store it,  
//
//   MAKE SURE to SET THE PATH on the next line:

   let imgPath = "Images/Icons/Custom/LootBag1.svg";  
//      Make this match your image path 

// LIGHT EFFECT
//   Creates a color-shifting light effect. 
//   WARNING: This will overwrite any existing lighting. 
//     However, since they'd likely be dead at this point,
//     this probably doesn't matter too much. 
//
//
// OPTION SELECTION
//   To change options, set the number after the
//   "userOption =" below to your choice. 
//
//   Coin roll and -if enabled- 
//   Item Pile Transformation PLUS:
//       0 = No Special Effect       
//       1 = Light Effect only
//       2 = Change Image Only
//       3 = Both Image Change and Light effect

   let userOption = 1; 
// Change the 1 to another option's number if you choose. 
   
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////




for(let c of canvas.tokens.controlled){
  if (c.actor.data.data.details.level > 0) {
    console.log("XXXXX__//  ",c.data.name,"is a PC   \\\\__XXXXX");
    continue;
  } else {
    let tokActor = c.actor;
    
    const rand = new Roll("1d100").evaluate({async: false});

    console.log("_________________________________________________________")
    console.log("!!!",tokActor.data.name," Random Roll: ",rand.total);

    ///////// Coins /////////
    async function rollCoins(PP, GP, SP, CP) {    
        let currency = tokActor.data.data.currency;
    
        let rollCP = await new Roll(CP).roll({async:true});
        let rollSP = await new Roll(SP).roll({async:true});
        let rollGP = await new Roll(GP).roll({async:true});
        let rollPP = await new Roll(PP).roll({async:true});
    
        let actorCP = currency.cp + rollCP.total;
        let actorSP = currency.sp + rollSP.total;
        let actorGP = currency.gp + rollGP.total;
        let actorPP = currency.pp + rollPP.total;
        
        await tokActor.update({"data.currency.cp": currency.cp + rollCP.total, "data.currency.sp": currency.sp + rollSP.total, "data.currency.gp": currency.gp + rollGP.total, "data.currency.pp": currency.pp + rollPP.total});

        await console.log('>>>',tokActor.data.name,'Coins Added>>   CP:',rollCP.total,' // SP:',rollSP.total,' // GP:',rollGP.total,' // PP:',rollPP.total,' // ',);
    }

    if(rand.total<26){
        console.log(">>> No coins found")                 //Nothing

    } else if (rand.total>26 && rand.total<56){
        await rollCoins("0","0","0","1d10");              //6CP avg
    } else if (rand.total>55 && rand.total<80){
        await rollCoins("0","0","4d3","1d14+11");         //1GP avg
    } else if (rand.total>79 && rand.total<90){
        await rollCoins("0","2d3","2d10+10","1d21+39");   //5GP avg
    } else if (rand.total>89 && rand.total<95){
        await rollCoins("0","1d6+4","7d5","1d21+59");     //10GP avg
    } else if (rand.total>94 && rand.total<98){
        await rollCoins("0","1d10+5","15d6","50d3");      //20GP avg
    } else if (rand.total>97 && rand.total<100){
        await rollCoins("1d3","10d3+3","15d6","40d4");    //50GP avg
    } else {
        await rollCoins("3d3","24d2","10d6","25d6");      //100GP avg
    }
    
    console.log("_________________________________________________________")   
    
     
    if (c.actor.data.data.details.level > 0) {
       break;
    } else {   
        if (hasItemPiles === 1){
            ItemPiles.API.turnTokensIntoItemPiles(c);
        }
        if (userOption === 0){
        }else if (userOption === 1){
            await c.data.document.update({
                light:{
                    dim:0.2,
                    bright:0.2,
                    luminosity:0,
                    alpha:1,
                    color:'#ad8800',
                    coloration:6,
                    animation:{
                        type:"radialrainbow",
                        speed:3,
                        intensity:10
                    }
                }
            });
        } else if (userOption === 2){
            await c.document.update({img : imgPath, rotation : 0});
        } else if (userOption === 3){
            await c.data.document.update({
                img: imgPath,
                rotation : 0,
                light:{
                    dim:0.2,
                    bright:0.2,
                    luminosity:0,
                    alpha:1,
                    color:'#ad8800',
                    coloration:6,
                    animation:{
                        type:"radialrainbow",
                        speed:3,
                        intensity:10
                    }
                }
            });
        } else {
            ui.notifications.error(`Error with User Options. Choose a valid option.`);
        }
    }
  }
}
