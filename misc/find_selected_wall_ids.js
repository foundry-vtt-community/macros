for (const [i, wall] of canvas.walls.controlled.entries()) {
	const text = new PIXI.Text(`${i} - ${wall.id}`);
	text.anchor.set(0.5);
	text.x = (wall.data.c[0] + wall.data.c[2]) / 2;
	text.y = (wall.data.c[1] + wall.data.c[3]) / 2;
	text.name = wall.id;
	text.style = new PIXI.TextStyle({ fill: 0xffffff, dropShadow: true, fontSize: 20 });
	wall.addChild(text);
}

const wallIds = canvas.walls.controlled.map((x) => x.id);
const wallsToExport = new Set(wallIds);

new Dialog({
	title: "Selected Wall IDs",
	content: `
${[...wallIds.entries()].map(([i, x]) => `<div><input data-i="${i}" checked type="checkbox"> ${i}: <b>${x}</b></div>`).join("")}
<p style="text-align:right">
<span class="span-copy-text" style="display:none;opacity:0.7">(copied) </span>
<button style="width:auto" class="button-copy-text">Copy JS Array</button>
</p>`,
	buttons: { close: { label: "Close" } },
	close() {
		for (const wall of canvas.walls.placeables) {
			const child = wall.children.find((w) => w.name === wall.id);
			if (child) wall.removeChild(child);
		}
	},
	render(html) {
		html.find(`input[type=checkbox]`).on("change", function () {
			const $this = $(this);
			const index = +$this.attr("data-i");
			if ($this.prop("checked")) wallsToExport.add(wallIds[index]);
			else wallsToExport.delete(wallIds[index]);
		});

		html.find(".button-copy-text").on("click", async () => {
			const toCopy = JSON.stringify(wallIds.filter((w) => wallsToExport.has(w)));
			await navigator.clipboard.writeText(toCopy);
			html.find(".span-copy-text").css("display", "unset");
		});
	},
}).render(true);
