/*
Display a prompt which allows you to select actors to add to the current combat encounter.
This is especially useful if you are running an encounter without a scene or tokens.
You can see it in action here: https://cdn.discordapp.com/attachments/960551198342139995/966856419787833384/Peek_2022-04-21_20-21.mp4
*/

Dialog.confirm({
    title: "Who would you like to add to the current combat?",
    content: `<template><div style="display: flex; gap: 1em; align-items: center;"><input type="number" style="width: 3em;" value="0" min="0"></input><p style="margin: .5em 0;"><slot name="name"></slot> [<slot name="id"></slot>]</p></div></template><section></section>`,
    render: html => {
        const section = html[0].querySelector("section");
        const template = html[0].querySelector("template");
        
        for (const actor of game.actors) {
            const item = document.createElement("div");
            item.style.margin = ".5em 0";
            
            const name = document.createElement("span");
            name.slot = "name";
            name.textContent = actor.name;
            item.append(name);

            const id = document.createElement("code");
            id.slot = "id";
            id.textContent = actor.id;
            item.append(id);

            const shadowRoot = item.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            
            section.append(item);
        }
    },
    yes: html => {
        const updates = [];
        html[0].querySelectorAll("template ~ section > div").forEach(el => {
            const id = el.querySelector("code").textContent;
            let quantity = el.shadowRoot.querySelector("input").value;
            while (quantity > 0) {
                updates.push({ "actorId": id });
                quantity--;
            }
        });
        game.combat?.createEmbeddedDocuments("Combatant", updates);
    },
});
