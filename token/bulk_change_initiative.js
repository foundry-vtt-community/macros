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
            if(!game.combat) return;
            const initadjust = parseInt(html.find('[name="init-adjust"]')[0].value || "0");
            const updates = canvas.tokens.controlled.reduce((acc, t) => {
                if(!t.combatant) return acc;
                acc.push({_id: t.combatant.id, initiative: initadjust});
                return acc;  
            },[]);
            game.combat.updateEmbeddedDocuments("Combatant", updates)
        }
    }   
}).render(true);