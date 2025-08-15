/* fetch('http://localhost:4000/card/102380')
  .then(res => res.json())
  .then(data => console.log(data)); */


type Filter = {
  field:string;
  filterbycolumn:string;
  operator:string;
}

interface Card {
  name: string;
  desc: string;
  id:number;
  ot:number;
  alias:number;
  setcode:number;
  type:number;
  atk: number;
  def: number;
  level: number;
  race: number;
  attribute: number;
  category: number;
}

interface CardTranslated {
  name: string;
  desc: string;
  id:number;
  ot:number;
  alias:number;
  setcode:number;
  type:string;
  atk: number;
  def: number;
  level: number;
  race: string;
  attribute: string;
  category: string;
}
export async function DisplayDatabase(keyword: string) {
  const app = document.getElementById('app');
  if (!app) return;

  // Supprimer le conteneur précédent s'il existe
  const oldContainer = document.getElementById('db-container');
  if (oldContainer) {
    oldContainer.remove();
  }

  try {
    //const response = await fetch(`http://localhost:4000/card/${encodeURIComponent(keyword)}`);
    const response = await fetch(`http://localhost:4000/card/${keyword}`);
    const data: Card[] = await response.json();

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
        const translatedRow = TranslateRow(row);
        Object.values(translatedRow).forEach(val => {
          const td = document.createElement('td');
          td.textContent = val !== null ? String(val) : "-";
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

    app.appendChild(container);
  } catch (err) {
    const errorMsg = document.createElement('p');
    errorMsg.textContent = `Erreur: ${err}`;
    app.appendChild(errorMsg);
  }
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
            await DisplayDatabase(field.value);
          }
      });

      app.appendChild(button);
    }
  });
}

export function TranslateRow(row: Card): CardTranslated
{
  const translatedRow: CardTranslated = {
    name: row.name,
    desc: row.desc,
    id:row.id,
    ot:row.ot,
    alias:row.alias,
    setcode:row.setcode,
    type:"",
    atk: row.atk,
    def: row.def,
    level: row.level,
    race: "",
    attribute: "",
    category: ""
  }

  translatedRow.type = TranslateType(row.type);
  translatedRow.race = TranslateRace(row.race);
  translatedRow.attribute = TranslateAttribute(row.attribute);
  translatedRow.category = TranslateCategory(row.category);
  return translatedRow;
}

function TranslateType(type: number): string
{
  return "";
}

function TranslateRace(race: number): string
{
  return "";
}

function TranslateAttribute(attribute: number): string
{
  return "";
}

function TranslateCategory(category: number): string
{
  return "";
}

initClientQueryDB();
