const express = require('express'); // Importation du module Express
const { register, login, createLobby } = require('../controllers/userController'); // Importation des fonctions `register`, `login`, `createLobby` du contrôleur
const authenticateJWT = require('../middleware/authMiddleware');  /// Importation du middleware d'authentification JWT

const router = express.Router(); // Création d'un routeur Express

// Route POST pour l'inscription à '/api/register'
router.post('/register', register);

// Route POST pour la connexion à '/api/login'
router.post('/login', login);

// Route pour créer un lobby (protégée par l'authentification JWT)
router.post('/create-lobby', authenticateJWT, createLobby);

module.exports = router; // Exportation du routeur pour utilisation dans app.js



