import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import { log } from 'console';



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
      const [rows] = await connection.query("SELECT * FROM `yugidb` WHERE name_fr LIKE ?",
        [`${req.query.message}%`]
      );
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  // ✅ POST - Ajouter un nouvel utilisateur
  app.post("/yugidb", async (req: Request, res: Response) => {
    const { name_fr, name_en, reference } = req.body;

    if (!name_fr || !name_en || !reference) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    try {
      const [result] = await connection.execute(
        'INSERT INTO yugidb (name_fr, name_en, reference) VALUES (?, ?, ?)',
        [name_fr, name_en, reference]
      );

      res.status(201).json({ message: "Add card successfully" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      res.status(500).json({ message: "Erreur serveur" });
    } finally {
    }
  });




  app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
  });
}

main().catch(console.error);


