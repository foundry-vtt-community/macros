//for the selected tokens, adjust their initiative by X.  Use with selective-select to modify all enemies, friendlies

let applyChanges = false;

new Dialog({
    title: `Bulk change initiative`,
    content: `
      <form>
        <div class="form-group">
          <label>Initiative adjustment:</label>
          <input id="init-adjust" name="init-adjust" type="number" step="1" value="0"/>
        </div>
      </form>
      `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Apply Changes`,
        callback: () => applyChanges = true
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel Changes`
      },
    },
    default: "yes",
    close: html => {
      if (applyChanges) {
          let initadjust = parseInt(html.find('[name="init-adjust"]')[0].value || "0");
        for ( let token of canvas.tokens.controlled ) {
            for(let count=0;count<game.combat.combatants.length;count++){
                if(token.data._id==game.combat.combatants[count].tokenId){
                    game.combat.setInitiative(game.combat.combatants[count]._id,game.combat.combatants[count].initiative+initadjust);
                    break;
                }
            }
        }
      }
    }
  }).render(true);
