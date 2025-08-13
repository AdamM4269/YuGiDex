import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import Database from 'better-sqlite3';
function CreateQuery(filter) {
    const filterJson = JSON.parse(filter);
    let fieldToQuery = filterJson.field;
    if (filterJson.operator === "startswith") {
        fieldToQuery = fieldToQuery + "%";
    }
    else if (filterJson.operator === "startswith") {
        fieldToQuery = "%" + fieldToQuery;
    }
    else {
        fieldToQuery = "%" + fieldToQuery + "%";
    }
    let query = "SELECT * FROM `yugidb` WHERE " + filterJson.filterbycolumn + " LIKE '" + fieldToQuery + "'";
    return query;
}
async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'node',
    });
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    const port = process.env.PORT || 5000;
    await app.get("/", async (req, res) => {
        // Crée la connexion (ici, avec mysql2/promise)
        try {
            console.log(req.query.message);
            const filterToQuery = CreateQuery(req.query.message);
            const [rows] = await connection.query(filterToQuery);
            res.json(rows);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
    // ✅ POST - Ajouter un nouvel utilisateur
    app.post("/yugidb", async (req, res) => {
        const { name_fr, name_en, reference } = req.body;
        if (!name_fr || !name_en || !reference) {
            return res.status(400).json({ message: "Champs manquants" });
        }
        try {
            const [result] = await connection.execute('INSERT INTO yugidb (name_fr, name_en, reference) VALUES (?, ?, ?)', [name_fr, name_en, reference]);
            res.status(201).json({ message: "Add card successfully" });
        }
        catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
        finally {
        }
    });
    app.listen(port, () => {
        console.log(`Serveur lancé sur http://localhost:${port}`);
    });
    const db = new Database('bdd/cdb/cards.delta.cdb');
    const app2 = express();
    app2.use(cors());
    app2.use(bodyParser.json());
    const port2 = process.env.PORT || 4000;
    // Endpoint pour récupérer une carte par ID
    app2.get('/card/:id', (req, res) => {
        const stmt = db.prepare(`
      SELECT texts.name, texts.desc, datas.atk, datas.def
      FROM texts
      JOIN datas ON texts.id = datas.id
      WHERE texts.id = ?
    `);
        const card = stmt.get(Number(req.params.id));
        res.json(card || {});
    });
    app2.listen(port2, () => {
        console.log(`Serveur lancé sur http://localhost:${port2}`);
    });
}
main().catch(console.error);
