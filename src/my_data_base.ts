export default async function initClient2() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = "<h1>Client 2</h1><p>Chargement...</p>";

  try {
    const response = await fetch("http://localhost:5000/?message=.fr"); // URL de ton API
    const data = await response.json();

    let html = "<h1>Client 2</h1><table border='1'><tr>";
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
      });
      html += "</tr>";
      data.forEach((row: any) => {
        html += "<tr>";
        Object.values(row).forEach(val => {
          html += `<td>${val}</td>`;
        });
        html += "</tr>";
      });
      html += "</table>";
    } else {
      html += "<p>Aucune donnée trouvée</p>";
    }

    app.innerHTML = html;
  } catch (err) {
    app.innerHTML = `<p>Erreur: ${err}</p>`;
  }
}

await initClient2();