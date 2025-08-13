# YuGiDex



## Installation

### 1. Prérequis
- **Node.js** (version recommandée : LTS)  
  Téléchargez et installez depuis : [https://nodejs.org/](https://nodejs.org/)

- **MAMP** (pour MySQL et serveur local)  
  Téléchargez et installez depuis : [https://www.mamp.info/](https://www.mamp.info/)

- **Git** (optionnel mais recommandé)  
  Téléchargez et installez depuis : [https://git-scm.com/](https://git-scm.com/)

### 2. Installation du projet
```bash
# Cloner le projet (ou dézipper)
git clone <url-du-repo>  
cd Projet_VF

# Installer les dépendances
npm install
```

### 3. Configuration de la base de données
1. Lancez **MAMP** et démarrez les serveurs **Apache** et **MySQL**.  
2. Ouvrez **phpMyAdmin** (accessible via [http://localhost/phpMyAdmin](http://localhost/phpMyAdmin)).  
3. Créez une base de données avec le nom requis (vérifiez le code source pour le nom exact).  
4. Importez les tables si un fichier `.sql` est fourni.

### 4. Lancement du projet
- Mode développement :  
```bash
npm run dev
```

- Mode production :  
```bash
npm run build
npm start
```

### 5. Dépendances du projet
**Dépendances** :
- body-parser: ^2.2.0
- cors: ^2.8.5
- express: ^5.1.0
- mongodb: ^6.18.0
- mysql2: ^3.14.3
- ocr-space-api-wrapper: ^2.4.1

**Dépendances de développement** :
- @types/body-parser: ^1.19.6
- @types/cors: ^2.8.19
- @types/express: ^5.0.3
- @types/mongodb: ^4.0.6
- @types/node: ^24.2.1
- nodemon: ^3.1.10
- ts-node: ^10.9.2
- typescript: ^5.9.2
- undici-types: ^7.13.0
