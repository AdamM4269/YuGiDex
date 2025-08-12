"use strict";
async function loadUI() {
    const response = await fetch("layout.json");
    const elements = await response.json();
    const app = document.getElementById("app");
    if (!app)
        return;
    elements.forEach((element) => {
        if (element.type === "name" || element.type === "reference") {
            const label = document.createElement("label");
            label.textContent = element.label || "";
            const input = document.createElement("input");
            input.type = element.type;
            input.placeholder = element.placeholder || "";
            input.id = element.id;
            app.appendChild(label);
            app.appendChild(input);
        }
        if (element.type === "button") {
            const button = document.createElement("button");
            button.textContent = element.text || "Bouton";
            button.id = element.id;
            button.addEventListener("click", () => {
                const result = {
                    name_fr: document.getElementById("namefr")?.value,
                    name_en: document.getElementById("nameen")?.value,
                    reference: document.getElementById("reference")?.value
                };
                CatchResult(result);
            });
            app.appendChild(button);
        }
    });
}
async function CatchResult(result) {
    fetch('http://localhost:5000/yugidb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    })
        .then(res => res.json())
        .then(data => console.log(data));
    console.log("J'ai fait des trucs");
}
loadUI();
