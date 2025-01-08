// Importation du module mysql2/promise pour gérer la base de données MySQL avec des promesses.
const mysql = require('mysql2/promise');

// Importation de dotenv pour charger les variables d'environnement à partir du fichier `.env`.
require('dotenv').config();

// Création d'un pool de connexions à la base de données.
// Les informations de connexion sont récupérées depuis les variables d'environnement.
const db = mysql.createPool({
    host: process.env.DB_HOST, // Adresse du serveur MySQL (exemple : localhost).
    user: process.env.DB_USER, // Nom d'utilisateur pour accéder à MySQL.
    password: process.env.DB_PASSWORD, // Mot de passe de l'utilisateur.
    database: process.env.DB_NAME, // Nom de la base de données à utiliser.
});

// Exportation de la connexion pour pouvoir l'utiliser dans d'autres fichiers du projet.
module.exports = db;
