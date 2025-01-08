const express = require('express'); // Importation du module Express
const { register, login } = require('../controllers/userController'); // Importation des fonctions `register` et `login` du contrôleur

const router = express.Router(); // Création d'un routeur Express

// Route POST pour l'inscription à '/api/register'
router.post('/register', register); 

// Route POST pour la connexion à '/api/login'
router.post('/login', login); // Ajout de la route pour la connexion

module.exports = router; // Exportation du routeur pour utilisation dans app.js


