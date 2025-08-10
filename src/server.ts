import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';



async function main() {

  const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'node',
    });


  const app = express();
  const port = process.env.PORT || 5000;
  await app.get("/", async (req, res) =>{
    // Crée la connexion (ici, avec mysql2/promise)
    try {
      console.log("Connecté avec succès");

      // Exemple de requête
      const [rows, fields] = await connection.query<any[]>('SELECT * FROM users');;
      console.log("Les données sont : ", rows);
      console.log(rows);
      res.json(rows)

    } catch (err) {
      console.error("Erreur de connexion ou de requête :", err);
    } finally {
      await connection.end();  // ferme la connexion proprement
    }
  });

// ✅ POST - Ajouter un nouvel utilisateur
  app.post("/users", async (req: Request, res: Response) => {
    const { name, age } = req.body;

    if (!name || typeof age !== 'number') {
      return res.status(400).json({ error: "Nom et âge requis." });
    }

    try {
      const [result] = await connection.execute(
        'INSERT INTO users (name, age) VALUES (?, ?)',
        [name, age]
      );

      res.status(201).json({ message: "Utilisateur ajouté", id: (result as any).insertId });
    } catch (err) {
      console.error("❌ Erreur INSERT :", err);
      res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur." });
    }
  });



  app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
  });
}

main().catch(console.error);


