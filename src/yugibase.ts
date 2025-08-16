/* fetch('http://localhost:4000/card/102380')
  .then(res => res.json())
  .then(data => console.log(data)); */

import { transferableAbortController } from "util";
import { brotliCompress } from "zlib";


type Filter = {
  field:string;
  filterbycolumn:string;
  operator:string;
}

interface Card {
  //texts.name, datas.type, datas.attribute, datas.race, datas.level, datas.atk, datas.def, datas.id, texts.desc
  name: string;
  type: number;
  attribute:number;
  race:number;
  level:number;
  atk:number;
  def:number;
  desc: string;
  id: number;
}

interface CardTranslated {
  name: string;
  type: string;
  attribute:string;
  race:string;
  level:number;
  atk:number;
  def:number;
  desc: string;
  id: number;
}

type FilterYuGiBase = {
  field: string|number;
  column: string;
  orderBy:string;

}
export async function DisplayDatabase(filter: string) {
  const app = document.getElementById('app');
  if (!app) return;

  const oldContainer = document.getElementById('db-container');
  if (oldContainer) {
    oldContainer.remove();
  }

  try {
    const response = await fetch(`http://localhost:4000/card/${filter}`);
    const data: Card[] = await response.json();

    const container = document.createElement('div');
    container.id = 'db-container';

    const title = document.createElement('h1');
    title.textContent = "Mes cartes en base";
    container.appendChild(title);

    if (data && data.length > 0) {
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

        Object.entries(translatedRow).forEach(([key, val]) => {
          const td = document.createElement('td');

          if (key.toLowerCase() === 'name' && row.id != null) {
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = String(val);
            a.addEventListener('click', (e) => {
              e.preventDefault();
              // Stocker l'ID dans localStorage
              localStorage.setItem("selectedCardId", String(row.id));
              // Ouvrir la page sans paramètre
              window.open(`${window.location.origin}/card.html`, '_blank', 'noopener');
            });
            td.appendChild(a);
          } else {
            td.textContent = val !== null ? String(val) : '-';
          }

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
  const response = await fetch("layout_yugibase.json");
  const elements: UIElement[] = await response.json();
  const app = document.getElementById("app");

  if (!app) return;

  elements.forEach((element) => {
    if (element.type === "field") {
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
        const field = document.getElementById("field") as HTMLInputElement;
        let translatedField:string|number = "";
        const filterbycolumn = document.getElementById("filterbycolumn") as HTMLInputElement;
        const orderby = document.getElementById("orderby") as HTMLInputElement;
        if(filterbycolumn.value === "datas.type")
        {
          translatedField = TranslateTypeReverse(field.value);
        }
        else if(filterbycolumn.value === "datas.race")
        {
          translatedField = TranslateRaceReverse(field.value);
        }
        else if(filterbycolumn.value === "datas.attribute")
        {
          translatedField = TranslateAttributeReverse(field.value);
        }
        else {
          translatedField = field.value;
        }
        const filter: FilterYuGiBase = {
          field:translatedField,
          column:filterbycolumn.value,
          orderBy:orderby.value
        }
          if (filter) {
            await DisplayDatabase(JSON.stringify(filter));
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
    type: "",
    attribute: "",
    race: "",
    level:row.level,
    atk:row.atk,
    def:row.def,
    desc: row.desc,
    id: row.id
  }

  translatedRow.type = TranslateType(row.type);
  translatedRow.race = TranslateRace(row.race);
  translatedRow.attribute = TranslateAttribute(row.attribute);
  return translatedRow;
}

function TranslateType(type: number): string
{
  let translatedType = "";
  switch (type)
  {
    case 2:
      translatedType = "Normal Spell";
      break;
    case 65538:
      translatedType = "Quick Spell";
      break;
    case 131074:
      translatedType = "Continuous Spell ";
      break;
    case 524290:
      translatedType = "Field Spell";
      break;
    case 1048580:
      translatedType = "Counter Trap";
      break;
    case 131076:
      translatedType = "Continuous Trap";
      break;
    case 4:
      translatedType = "Normal Trap";
      break;
    case 17:
      translatedType = "Normal Monster";
      break;
    case 33:
      translatedType = "Effect Monster";
      break;
    case 97:
      translatedType = "Fusion/Effect Monster";
      break;
    case 65:
      translatedType = "Fusion/Normal Monster";
      break;
    case 8388641:
      translatedType = "Xyz Monster";
      break;
    case 8225:
      translatedType = "Synchro Monster";
      break;
    case 67108897:
      translatedType = "Link/Effect Monster";
      break;
    case 67108865:
      translatedType = "Link/Normal Monster";
      break;
    case 4129:
      translatedType = "Effect/Tuner Monster";
      break;
    case 4113:
      translatedType = "Normal/Tuner Monster";
      break;
    case 2081:
      translatedType = "Gemini Monster";
      break;
    case 1057:
      translatedType = "Union Monster";
      break;
    case 545:
      translatedType = "Spirit Monster";
      break;
    case 673:
      translatedType = "Ritual/Spirit Monster";
      break;
    case 1900:
      translatedType = "Flip Monster";
      break;
    case 4194337:
      translatedType = "Toon Monster";
      break;
    case 16781345:
      translatedType = "Pendulum/Tuner Monster";
    case 4193:
      translatedType = "Fusion/Tuner Monster";
      break;
    case 4257:
      translatedType = "Ritual/Tuner Monster";
      break;
    case 12321:
      translatedType = "Synchro/Tuner Monster";
      break;
    case 25165857:
      translatedType = "Xyz/Pendulum Monster";
      break;
    case 16777233:
      translatedType = "Pendulum/Normal Monster";
      break;
    case 2097185:
      translatedType = "Flip Monster"
      break;
    case 262146:
      translatedType = "Equip Spell "
      break;

  }
  return translatedType;
}

function TranslateRace(race: number): string
{
  let translatedRace = "";

  switch(race)
  {
    case 0:
      translatedRace = "";
      break;
    case 1:
      translatedRace = "Warrior";
      break;
    case 2:
      translatedRace = "Spellcaster";
      break;
    case 4:
      translatedRace = "Fairy";
      break;
    case 8:
      translatedRace = "Fiend";
      break;
    case 16:
      translatedRace = "Zombie";
    case 32:
      translatedRace = "Machine";
    case 64:
      translatedRace = "Aqua";
      break;
    case 128:
      translatedRace = "Pyro";
      break;
    case 256:
      translatedRace = "Rock";
      break;
    case 512:
      translatedRace = "Winged-Beast";
      break;
    case 1024:
      translatedRace = "Plant";
      break;
    case 2048:
      translatedRace = "Insect";
      break;
    case 4096:
      translatedRace = "Thunder";
      break;
    case 8192:
      translatedRace = "Dragon";
      break;
    case 16384:
      translatedRace = "Beast";
      break;
    case 32768:
      translatedRace = "Beast-Warrior";
      break;
    case 65536:
      translatedRace = "Dinosaur";
      break;
    case 131072:
      translatedRace = "Fish";
      break;
    case 2^18:
      translatedRace = "Sea-Serpent";
      break;
    case 2^19:
      translatedRace = "Reptil";
      break;
    case 2^20:
      translatedRace = "Psychic";
      break;
    case 2^21:
      translatedRace = "Divine-Beast";
      break;
    case 2^22:
      translatedRace = "Creator God";
      break;
    case 2^23:
      translatedRace = "Wyrm";
      break;
    case 2^24:
      translatedRace = "Cyberse";
      break;
    case 2^25:
      translatedRace = "Illusion";
      break;
    case 2^26:
      translatedRace = "Cyborg";
      break;
    case 2^27:
      translatedRace = "Magical Knight";
      break;
    case 2^28:
      translatedRace = "High Dragon";
      break;
    case 2^29:
      translatedRace = "Omega Psychic";
      break;
    case 2^30:
      translatedRace = "Celestial Warrior";
      break;
    case 2^31:
      translatedRace = "Galaxy";
      break;
    case 2^32:
      translatedRace = "Yokai";
      break;
  }
  return translatedRace;
}

function TranslateAttribute(attribute: number): string
{
  let translatedAttribute = "";

  switch(attribute)
  {
    case 0:
      translatedAttribute = "";
      break;
    case 4:
      translatedAttribute = "Fire";
      break;
    case 16:
      translatedAttribute = "Light";
      break;
    case 1:
      translatedAttribute = "Earth";
      break;
    case 32:
      translatedAttribute = "Dark";
      break;
    case 2:
      translatedAttribute = "Water";
      break;
    case 8:
      translatedAttribute = "Wind";
      break;
    case 64:
      translatedAttribute = "Divine";
      break;
  }
  return translatedAttribute;
}

function TranslateTypeReverse(typeName: string): number {
  switch (typeName) {
    case "Normal Spell": return 2;
    case "Quick Spell": return 65538;
    case "Continuous Spell": return 131074;
    case "Field Spell": return 524290;
    case "Counter Trap": return 1048580;
    case "Continuous Trap": return 131076;
    case "Normal Trap": return 4;
    case "Normal Monster": return 17;
    case "Effect Monster": return 33;
    case "Fusion/Effect Monster": return 97;
    case "Fusion/Normal Monster": return 65;
    case "Xyz Monster": return 8388641;
    case "Synchro Monster": return 8225;
    case "Link/Effect Monster": return 67108897;
    case "Link/Normal Monster": return 67108865;
    case "Effect/Tuner Monster": return 4129;
    case "Normal/Tuner Monster": return 4113;
    case "Gemini Monster": return 2081;
    case "Union Monster": return 1057;
    case "Spirit Monster": return 545;
    case "Ritual/Spirit Monster": return 673;
    case "Flip Monster": return 1900;
    case "Toon Monster": return 4194337;
    case "Pendulum/Tuner Monster": return 16781345;
    case "Fusion/Tuner Monster": return 4193;
    case "Ritual/Tuner Monster": return 4257;
    case "Synchro/Tuner Monster": return 12321;
    case "Xyz/Pendulum Monster": return 25165857;
    case "Pendulum/Normal Monster": return 16777233;
    case "Flip Monster": return 2097185;
    case "Equip Spell": return 262146;
    default: return -1; // si le type est inconnu
  }
}

function TranslateRaceReverse(raceName: string): number {
  switch (raceName) {
    case "": return 0;
    case "Warrior": return 1;
    case "Spellcaster": return 2;
    case "Fairy": return 4;
    case "Fiend": return 8;
    case "Zombie": return 16;
    case "Machine": return 32;
    case "Aqua": return 64;
    case "Pyro": return 128;
    case "Rock": return 256;
    case "Winged-Beast": return 512;
    case "Plant": return 1024;
    case "Insect": return 2048;
    case "Thunder": return 4096;
    case "Dragon": return 8192;
    case "Beast": return 16384;
    case "Beast-Warrior": return 32768;
    case "Dinosaur": return 65536;
    case "Fish": return 131072;
    case "Sea-Serpent": return 262144;   // 2 ** 18
    case "Reptil": return 524288;        // 2 ** 19
    case "Psychic": return 1048576;      // 2 ** 20
    case "Divine-Beast": return 2097152; // 2 ** 21
    case "Creator God": return 4194304;  // 2 ** 22
    case "Wyrm": return 8388608;         // 2 ** 23
    case "Cyberse": return 16777216;     // 2 ** 24
    case "Illusion": return 33554432;    // 2 ** 25
    case "Cyborg": return 67108864;      // 2 ** 26
    case "Magical Knight": return 134217728; // 2 ** 27
    case "High Dragon": return 268435456;    // 2 ** 28
    case "Omega Psychic": return 536870912;  // 2 ** 29
    case "Celestial Warrior": return 1073741824; // 2 ** 30
    case "Galaxy": return 2147483648;         // 2 ** 31
    case "Yokai": return 4294967296;          // 2 ** 32
    default: return -1; // inconnu
  }
}

function TranslateAttributeReverse(attributeName: string): number {
  switch (attributeName) {
    case "": return 0;
    case "Fire": return 4;
    case "Light": return 16;
    case "Earth": return 1;
    case "Dark": return 32;
    case "Water": return 2;
    case "Wind": return 8;
    case "Divine": return 64;
    default: return -1; // inconnu
  }
}



initClientQueryDB();
