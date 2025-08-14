/* fetch('http://localhost:4000/card/102380')
  .then(res => res.json())
  .then(data => console.log(data)); */
export async function DisplayDatabase(keyword) {
    const app = document.getElementById('app');
    if (!app)
        return;
    // Supprimer le conteneur précédent s'il existe
    const oldContainer = document.getElementById('db-container');
    if (oldContainer) {
        oldContainer.remove();
    }
    try {
        //const response = await fetch(`http://localhost:4000/card/${encodeURIComponent(keyword)}`);
        const response = await fetch(`http://localhost:4000/card/3000`);
        const data = await response.json();
        const container = document.createElement('div');
        container.id = 'db-container';
        const title = document.createElement('h1');
        title.textContent = "Mes cartes en base";
        container.appendChild(title);
        if (data) {
            const table = document.createElement('table');
            table.border = "1";
            // Ligne d'en-tête
            const headerRow = document.createElement('tr');
            Object.keys(data[0]).forEach((key) => {
                const th = document.createElement('th');
                th.textContent = key.toUpperCase();
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);
            // Lignes de données
            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(val => {
                    const td = document.createElement('td');
                    td.textContent = val !== null ? String(val) : "-";
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
            container.appendChild(table);
        }
        else {
            const msg = document.createElement('p');
            msg.textContent = "Aucune donnée trouvée";
            container.appendChild(msg);
        }
        app.appendChild(container);
    }
    catch (err) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `Erreur: ${err}`;
        app.appendChild(errorMsg);
    }
}
DisplayDatabase("Coucou");
