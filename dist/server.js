import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
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
            console.log("Connecté avec succès");
            // Exemple de requête
            const [rows, fields] = await connection.query('SELECT * FROM users');
            ;
            console.log("Les données sont : ", rows);
            console.log(rows);
        }
        catch (err) {
            console.error("Erreur de connexion ou de requête :", err);
        }
        finally {
        }
    });
    // ✅ POST - Ajouter un nouvel utilisateur
    app.post("/users", async (req, res) => {
        const { pseudo, mail } = req.body;
        if (!pseudo || !mail) {
            return res.status(400).json({ message: "Champs manquants" });
        }
        try {
            const [result] = await connection.execute('INSERT INTO users (pseudo, mail) VALUES (?, ?)', [pseudo, mail]);
            res.status(201).json({ message: "Utilisateur ajouté avec succès" });
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
}
main().catch(console.error);
