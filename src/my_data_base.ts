type Filter = {
  field:string;
  filterbycolumn:string;
  operator:string;
}

export default async function initClientQueryDB()
{
  const response = await fetch("layout_client_db.json");
  const elements: UIElement[] = await response.json();
  const app = document.getElementById("app");

  if (!app) return;

  elements.forEach((element) => {
    if (element.type === "cardname") {
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

      button.addEventListener("click", async () => {
        const field = document.getElementById("cardname") as HTMLInputElement;
        const filterbycolumn = document.getElementById("filterbycolumn") as HTMLInputElement;
        const operator = document.getElementById("operators") as HTMLInputElement;
        const filter: Filter = {
          field:field.value,
          filterbycolumn:filterbycolumn.value,
          operator:operator.value
        }
          if (filter) {
            await DisplayDatabase(JSON.stringify(filter));
          }
      });

      app.appendChild(button);
    }
  });
}

export async function DisplayDatabase(filer: string) {
  const app = document.getElementById('app');
  if (!app) return;

  const oldContainer = document.getElementById('db-container');
  if (oldContainer) {
    oldContainer.remove();
  }

  try {
    const response = await fetch(`http://localhost:5000/?message=${filer}`); // URL de ton API
    const data = await response.json();

    const container = document.createElement('div'); // On met le tableau dans un conteneur
    container.id = 'db-container';
    const title = document.createElement('h1');
    title.textContent = "Mes cartes en base";
    container.appendChild(title);

    if (data.length > 0) {
      const table = document.createElement('table');
      table.border = "1";

      // Ligne d'en-tête
      const headerRow = document.createElement('tr');
      Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Lignes de données
      data.forEach((row: any) => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(val => {
          const td = document.createElement('td');
          td.textContent = String(val);
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });

      container.appendChild(table);
    } else {
      const msg = document.createElement('p');
      msg.textContent = "Aucune donnée trouvée";
      container.appendChild(msg);
    }

    app.appendChild(container); // On ajoute à la fin, sans toucher au reste
  } catch (err) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = `Erreur: ${err}`;
    app.appendChild(errorMsg);
  }
}

await initClientQueryDB();


