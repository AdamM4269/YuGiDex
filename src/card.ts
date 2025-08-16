// card.ts

async function loadCardDetails() {
  const cardId = localStorage.getItem("selectedCardId");

  if (!cardId) {
    document.body.innerHTML += `<p>Aucun ID trouvé dans le localStorage</p>`;
    return;
  }

  try {
    const response = await fetch(`http://localhost:2000/card/${cardId}`); // URL de ton API
    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const card = await response.json();

    // Injection dans la page
    (document.getElementById("card-name") as HTMLElement).textContent = card.name;
    (document.getElementById("card-desc") as HTMLElement).textContent = card.desc;
    (document.getElementById("card-atk") as HTMLElement).textContent = card.atk ?? "-";
    (document.getElementById("card-def") as HTMLElement).textContent = card.def ?? "-";

    const img = document.getElementById("card-image") as HTMLImageElement;
    img.src = `https://images.ygoprodeck.com/images/cards/${cardId}.jpg`;

  } catch (err) {
    document.body.innerHTML += `<p>Erreur: ${err}</p>`;
  }
}

// On attend que le DOM soit prêt
document.addEventListener("DOMContentLoaded", loadCardDetails);
