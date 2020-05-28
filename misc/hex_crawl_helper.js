/*
Required Rollable Tables:
*Wilderness Encounters*
    coast
    jungle1
    jungle2
    jungle3
    mountains
    rivers
    ruins
    swamp
    wasteland

*Other Tables*
    weather
    directions

    cache
    deadexplorers

Cache and Deadexplorers are not mandatory, but if you don't want them search the file for // CACHE LINES or // DEAD EXPLORER LINES and comment out the 2 lines below the comments

Explanation of those tables:
If you have an encounter table that has the word cache in it, the cache table will be rolled automatically.
    <br/><span id="cache">The party finds a cache: </span>
If you have an encounter table that has DeadExplorers in it, the dead explorer table will be rolled automatically.
    <br/><span id="DeadExplorers">The party finds: </span> 


You can have an automatic moving "Actual Location" Marker by creating a Token named "Actual Location" and placing it on your hex grid.
This will move if the players are "Lost". If the players are not lost it will not move.



*/


// Macro requires selecting a token to roll the survival check

let hexCrawl() => {
    if (canvas.tokens.controlled.length === 0)
        return ui.notifications.error("Please select the token of the Navigator!");

    const playerMarker = canvas.scene.data.tokens.find(a => a.name === 'Player Location');
    const locationMarker = canvas.scene.data.tokens.find(a => a.name === 'Actual Location');

    const gridSize = canvas.grid.size;
    const vertical = gridSize * 0.866666;
    const diagVertical = gridSize * 0.433333;
    const diagHorizontal = gridSize * 0.75;

    // The option values below are the names of your rollable tables for each hex type. If these get changed here you will need to change them in the Survival Check DC section too!

    let pace = 'none';
    new Dialog({
        title: `Hex Crawl Helper`,
        content: `
        <form>
            <div class="form-group">
                <label>Hex Type:</label>
                <select id="hex-type" name="hex-type">
                    <option value="coast">Coast</option>
                    <option value="jungle1">Jungle: No Undead</option>
                    <option value="jungle2">Jungle: Lesser Undead</option>
                    <option value="jungle3">Jungle: Greater Undead</option>
                    <option value="mountains">Mountains</option>
                    <option value="rivers">River</option>
                    <option value="ruins">Ruins</option>
                    <option value="swamp">Swamp</option>
                    <option value="wasteland">Wasteland</option>
                </select>
            </div>
            <div class="form-group">
                <label>Travel Direction:</label>
                <select id="travel-direction" name="travel-direction">
                    <option value="North">North</option>
                    <option value="Northeast">Northeast</option>
                    <option value="Southeast">Southeast</option>
                    <option value="South">South</option>
                    <option value="Southwest">Southwest</option>
                    <option value="Northwest">Northwest</option>
                </select>
            </div>
            <div class="form-group">
                <label>Travel Type:</label>
                <select id="travel-type" name="travel-type">
                    <option value="on-foot">On Foot</option>
                    <option value="canoe">By Canoe</option>
                </select>
            </div>
        </form>
        `,
        buttons: {
            slow: {
                icon: "<i class='fas fa-user-ninja'></i>",
                label: `Slow Pace`,
                callback: () => pace = 'slow'
            },
            average: {
                icon: "<i class='fas fa-hiking'></i>",
                label: `Average Pace`,
                callback: () => pace = 'average'
            },
            fast: {
                icon: "<i class='fas fa-running'></i>",
                label: `Fast Pace`,
                callback: () => pace = 'fast'
            }
        },
        default: "average",
        close: html => {
            // set variables
            let hexType = html.find('[name="hex-type"]')[0].value;
            let travelType = html.find('[name="travel-type"]')[0].value;
            let playerDirection = html.find('[name="travel-direction"]')[0].value;
            const weatherTable = game.tables.entities.find(t => t.name === "weather");
            const directionTable = game.tables.entities.find(t => t.name === "directions");
            const cacheTable = game.tables.entities.find(t => t.name === "cache");
            const deadExplorerTable = game.tables.entities.find(t => t.name === "deadexplorers");
            const encounterTable = game.tables.entities.find(t => t.name === hexType);
            let weatherRoll = weatherTable.roll()[1].text;
            let lostDirection = directionTable.roll()[1].text;
            let msgContent = '<strong>Weather</strong> ' + weatherRoll + '<br/><br/>';
            let navigator = Actors.instance.get(canvas.tokens.controlled[0].data.actorId);
            let wis = navigator.data.data.abilities.wis.mod;
            let survival = new Roll(`1d20`).roll().total + wis;
            let slowPace = new Roll(`1d4`).roll().total;
            let fastPace = new Roll(`1d2`).roll().total;
            let hexesMoved = 1;
            let encounter = '';
            let hexText = 'hexes';

            if (travelType === 'canoe') {
                hexesMoved++;
            }

            // build pace message and hex movement
            if (pace === 'slow') {
                if (slowPace === 1)
                    hexesMoved--;
                if (hexesMoved === 1)
                    hexText = 'hex';
                msgContent += '<strong>Slow pace:</strong> Can hide from encounters or approach stealthily.<br/><br/><strong>Party can move:</strong> ' + hexesMoved + ' ' + hexText + '.<br/><br/>';
                survival += 5;
            } else if (pace === 'average') {
                if (hexesMoved === 1)
                    hexText = 'hex';
                msgContent += '<strong>Average pace:</strong> For rivers, upstream and downstream have no effect, and waterfalls occur every 10 to 20 miles (requiring portage of canoes).<br/><br/><strong>Party can move:</strong> ' + hexesMoved + ' ' + hexText + '.<br/><br/>';
            } else if (pace === 'fast') {
                if (fastPace === 1)
                    hexesMoved++;
                if (hexesMoved === 1)
                    hexText = 'hex';
                msgContent += '<strong>Fast pace:</strong> -5 to passive Perception.<br/><br/><strong>Party can move:</strong> ' + hexesMoved + ' ' + hexText + '.<br/><br/>';
                survival -= 5;
            } else {
                return;
            }

            // Survival Check DC for each hex type. If selected token rolls under DC the party is lost!
            if (((hexType === 'coast' || hexType === 'ruins') && survival < 10) || ((hexType === 'jungle1' || hexType === 'jungle2' || hexType === 'jungle3' || hexType === 'mountains' || hexType === 'rivers' || hexType === 'swamp' || hexType === 'wasteland') && survival < 15)) {
                msgContent += '<strong>Party is Lost:</strong> Move actual location ' + hexesMoved + ' ' + hexText + ' to the ' + lostDirection + '<br/><br/>';
                if (locationMarker) {
                    const locToken = canvas.tokens.get(locationMarker._id);
                    switch (lostDirection) {
                        case 'South':
                            locToken.update({
                                x: locToken.x,
                                y: locToken.y + (vertical * hexesMoved)
                            });
                            break;

                        case 'Southwest':
                            locToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Southeast':
                            locToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'North':
                            locToken.update({
                                x: locToken.x,
                                y: locToken.y - (vertical * hexesMoved)
                            });
                            break;

                        case 'Northwest':
                            locToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Northeast':
                            locToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        default:
                            break;
                    }
                }
                if (playerMarker) {
                    const playerToken = canvas.tokens.get(playerMarker._id);
                    switch (playerDirection) {
                        case 'South':
                            playerToken.update({
                                x: playerToken.x,
                                y: playerToken.y + (vertical * hexesMoved)
                            });
                            break;

                        case 'Southwest':
                            playerToken.update({
                                x: playerToken.x - (diagHorizontal * hexesMoved),
                                y: playerToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Southeast':
                            playerToken.update({
                                x: playerToken.x + (diagHorizontal * hexesMoved),
                                y: playerToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'North':
                            playerToken.update({
                                x: playerToken.x,
                                y: playerToken.y - (vertical * hexesMoved)
                            });
                            break;

                        case 'Northwest':
                            playerToken.update({
                                x: playerToken.x - (diagHorizontal * hexesMoved),
                                y: playerToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Northeast':
                            playerToken.update({
                                x: playerToken.x + (diagHorizontal * hexesMoved),
                                y: playerToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        default:
                            break;
                    }
                }
            } else {
                if (playerMarker && locationMarker) {
                    const locToken = canvas.tokens.get(locationMarker._id);
                    const playerToken = canvas.tokens.get(playerMarker._id);

                    switch (playerDirection) {
                        case 'South':
                            playerToken.update({
                                x: locToken.x,
                                y: locToken.y + (vertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x,
                                y: locToken.y + (vertical * hexesMoved)
                            });
                            break;

                        case 'Southwest':
                            playerToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Southeast':
                            playerToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y + (diagVertical * hexesMoved)
                            });
                            break;

                        case 'North':
                            playerToken.update({
                                x: locToken.x,
                                y: locToken.y - (vertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x,
                                y: locToken.y - (vertical * hexesMoved)
                            });
                            break;

                        case 'Northwest':
                            playerToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x - (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        case 'Northeast':
                            playerToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            locToken.update({
                                x: locToken.x + (diagHorizontal * hexesMoved),
                                y: locToken.y - (diagVertical * hexesMoved)
                            });
                            break;

                        default:
                            break;
                    }
                }
            }

            msgContent += '<strong>Morning Encounter:</strong> ';

            if (new Roll(`1d20`).roll().total > 15) {
                encounter = encounterTable.roll()[1].text;
                msgContent += encounter;
                // CACHE LINES comment out the next 2 lines if you don't want to use a cache table!
                if (encounter.indexOf('cache') > -1)
                    msgContent += cacheTable.roll()[1].text + '<br/><br/>';
                // DEAD EXPLORER LINES comment out the next 2 lines if you don't want to use a dead explorer table!
                if (encounter.indexOf('DeadExplorers') > -1)
                    msgContent += deadExplorerTable.roll()[1].text + '<br/><br/>';
                msgContent += '<strong>Afternoon Encounter:</strong> ';
            } else {
                msgContent += 'None.<br/><br/><strong>Afternoon Encounter:</strong> ';
            }

            if (new Roll(`1d20`).roll().total > 15) {
                encounter = encounterTable.roll()[1].text;
                msgContent += encounter;
                // CACHE LINES comment out the next 2 lines if you don't want to use a cache table!
                if (encounter.indexOf('cache') > -1)
                    msgContent += cacheTable.roll()[1].text + '<br/><br/>';
                // DEAD EXPLORER LINES comment out the next 2 lines if you don't want to use a dead explorer table!
                if (encounter.indexOf('DeadExplorers') > -1)
                    msgContent += deadExplorerTable.roll()[1].text + '<br/><br/>';
                msgContent += '<strong>Evening Encounter:</strong> ';
            } else {
                msgContent += 'None.<br/><br/><strong>Evening Encounter:</strong> ';
            }

            if (new Roll(`1d20`).roll().total > 15) {
                encounter = encounterTable.roll()[1].text;
                msgContent += encounter;
                // CACHE LINES comment out the next 2 lines if you don't want to use a cache table!
                if (encounter.indexOf('cache') > -1)
                    msgContent += cacheTable.roll()[1].text + '<br/><br/>';
                // DEAD EXPLORER LINES comment out the next 2 lines if you don't want to use a dead explorer table!
                if (encounter.indexOf('DeadExplorers') > -1)
                    msgContent += deadExplorerTable.roll()[1].text + '<br/><br/>';
            } else {
                msgContent += 'None.';
            }

            // create the message
            let chatData = {
                content: msgContent,
                whisper: game.users.entities.filter(u => u.isGM).map(u => u._id)
            };
            ChatMessage.create(chatData, {});
        }
    }).render(true);
}

hexCrawl();