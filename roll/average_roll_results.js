/**
 * Reads the chat log for a specific type of die rolled and returns the average of that die type. If no input is provided, it will check all d20 rolls.
 */

let dialogue = new Dialog({
    title: `Dice rolls to check`,
    content: `<p>Enter the type of dice to check: <input type="number" id="diceFacesToCheck"></p>`,
    buttons: {
        one: {
            icon: '',
            label: 'Submit',
            callback: (html) => {
                const input = html.find('#diceFacesToCheck').val();
                const diceToCheck = input ? parseInt(input) : 20;
                const chatLog = game.messages;
                let rolls = 0;
                let total = 0;

                chatLog.forEach(entry => {
                    if (entry.roll) {
                        const { terms } = entry.roll;
                        terms
                            .filter(die => die.faces === diceToCheck)
                            .forEach(die => {
                                rolls = rolls + die.number;
                                total = total + die.total;
                            })
                    }
                });

                console.log(rolls, total);

                let dialogue = new Dialog({
                    title: `Average d${diceToCheck} rolls`,
                    content: `<p>Amount of d${diceToCheck}'s checked: ${rolls}</p><p>Average result: ${Math.round(((total / rolls) + Number.EPSILON) * 100) / 100}</p>`,
                    buttons: {
                        one: {
                            icon: '',
                            label: 'Close'
                        }
                    }
                })

                dialogue.render(true)
            }
        }
    }
})

dialogue.render(true)