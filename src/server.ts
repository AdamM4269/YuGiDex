import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import Database from 'better-sqlite3';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { MongoClient, Db, Collection, InsertOneResult } from 'mongodb';
import { log } from 'console';

type Filter = {
  field:string;
  filterbycolumn:string;
  operator:string;
}

interface Card {
  name: string;
  desc: string;
  atk: number;
  def: number;
  source: string; // nom de la base d'où vient la carte
}

type FilterYuGiBase = {
  field: any;
  column: string;
  orderBy:string;

}

// Recréer __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier où sont tes bases .cdb
const dossierBases = path.join(__dirname, '../bdd/cdb/cdb_vf');

// Lister tous les fichiers .cdb
const fichiersCdb = fs.readdirSync(dossierBases)
  .filter(f => f.toLowerCase().endsWith('.cdb'));

function CreateQuery(filter:string):string
{
  const filterJson: Filter = JSON.parse(filter);
  let fieldToQuery = filterJson.field;
  if(filterJson.operator === "startswith")
  {
    fieldToQuery = fieldToQuery+"%";
  } else if(filterJson.operator === "startswith")
  {
    fieldToQuery = "%"+fieldToQuery;
  } else 
  {
    fieldToQuery = "%"+fieldToQuery+"%";
  }
  let query = "SELECT * FROM `yugidb` WHERE "+filterJson.filterbycolumn+" LIKE '"+fieldToQuery+"'";

  return query; 
}

async function main() {

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mysql',
  });


  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const port = process.env.PORT || 5000;
  await app.get("/", async (req, res) => {
    // Crée la connexion (ici, avec mysql2/promise)
    try {
      console.log(req.query.message);
      const filterToQuery = CreateQuery(req.query.message as string);
      const [rows] = await connection.query(filterToQuery);
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

  const app2 = express();
  app2.use(cors());
  app2.use(bodyParser.json());
  const port2 = process.env.PORT || 4000;

  // Endpoint pour récupérer une carte par ID
  /* app2.get('/card/:atk', (req, res) => {
    const stmt = db.prepare(`
      SELECT texts.name, texts.desc, datas.atk, datas.def
      FROM texts
      JOIN datas ON texts.id = datas.id
      WHERE datas.atk = ?
    `);
    const card = stmt.all(Number(req.params.atk));
    res.json(card || {});
  }); */

// Route de recherche
// Route pour rechercher un nom dans toutes les bases
app2.get('/card/:name', (req, res) => {

  let search = "";
  let likeOrEqual = "";
  const searchJson: FilterYuGiBase = JSON.parse(req.params.name);
  console.log("Mon fichier JSON : "+searchJson)
  if(typeof searchJson.field === "string")
  {
    search = `%${searchJson.field}%`;
    likeOrEqual = "LIKE"
  } else
  {
    search = searchJson.field
    likeOrEqual = "=";
  }
    
  let resultats: any[] = [];

  fichiersCdb.forEach(fichier => {
    const cheminBase = path.join(dossierBases, fichier);
    const db = new Database(cheminBase);

    // Sélectionne toutes les colonnes de texts et datas
    const stmt = db.prepare(`
      SELECT texts.name, datas.type, datas.attribute, datas.race, datas.level, datas.atk, datas.def, texts.desc, datas.id
      FROM texts
      JOIN datas ON texts.id = datas.id
      WHERE ${searchJson.column} ${likeOrEqual} ?
      ORDER BY texts.name ${searchJson.orderBy}
    `);

    const cartes = stmt.all(search);
    resultats = resultats.concat(cartes);

    db.close();
  });

  // Suppression des doublons (basé sur l'id de la carte)
  const uniqueMap = new Map<number, any>();
  resultats.forEach(carte => {
    if (!uniqueMap.has(carte.id)) {
      uniqueMap.set(carte.id, carte);
    }
  });

  res.json(Array.from(uniqueMap.values()));
});

// Démarrage du serveur
  app2.listen(port2, () => {
    console.log(`Serveur lancé sur http://localhost:${port2}`);
  });

  const app3 = express();
  const port3 = 2000;

  app3.use(cors());

  // Endpoint test
  app3.get("/", (req, res) => {
    res.send("Serveur en ligne sur app3:2000 🚀");
  });

  // Endpoint : chercher une carte par ID
  app3.get("/card/:id", (req, res) => {
    const id = req.params.id;

    try {
      fichiersCdb.forEach(fichier => {
        const cheminBase = path.join(dossierBases, fichier);
        const db = new Database(cheminBase);
        const stmt = db.prepare(`
          SELECT texts.id, texts.name, texts.desc, datas.atk, datas.def
          FROM texts
          JOIN datas ON texts.id = datas.id
          WHERE texts.id = ?
        `);

        const card = stmt.get(id);

        if (!card) {
          res.status(404).json({ error: "Carte non trouvée" });
        } else {
          res.json(card);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne serveur" });
    }
  });

  // Lancer le serveur sur app3:6000
  app3.listen(port3, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${port3}`);
  });
}

main().catch(console.error);