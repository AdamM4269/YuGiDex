"use strict";
async function loadUI() {
    const response = await fetch("layout.json");
    const elements = await response.json();
    const app = document.getElementById("app");
    if (!app)
        return;
    elements.forEach((element) => {
        if (element.type === "text" || element.type === "email") {
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
                    name: document.getElementById("nom")?.value,
                    email: document.getElementById("email")?.value
                };
                CatchResult(result);
            });
            app.appendChild(button);
        }
    });
}
async function CatchResult(result) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        });
        if (response.ok) {
            alert('Données enregistrées avec succès !');
        }
        else {
            alert('Erreur lors de l’enregistrement');
        }
    }
    catch (error) {
        alert('Erreur réseau');
    }
}
loadUI();
