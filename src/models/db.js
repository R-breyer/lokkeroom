// Importation du module mysql2/promise pour gérer la base de données MySQL avec des promesses.
const mysql = require('mysql2/promise');

// Importation de dotenv pour charger les variables d'environnement à partir du fichier `.env`.
require('dotenv').config();

// Vérification de la présence des variables d'environnement nécessaires
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.error('Les variables d\'environnement pour la base de données ne sont pas définies.');
    process.exit(1); // Arrêter l'exécution si les variables d'environnement sont manquantes
}

// Création d'un pool de connexions à la base de données.
// Les informations de connexion sont récupérées depuis les variables d'environnement.
const db = mysql.createPool({
    host: process.env.DB_HOST, // Adresse du serveur MySQL
    user: process.env.DB_USER, // Nom d'utilisateur MySQL
    password: process.env.DB_PASSWORD, // Mot de passe MySQL
    database: process.env.DB_NAME, // Nom de la base de données
    port: process.env.DB_PORT, // Utilise la variable d'environnement ou le port par défaut
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// Exportation de la connexion pour pouvoir l'utiliser dans d'autres fichiers du projet.
module.exports = db;

