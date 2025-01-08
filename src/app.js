const express = require('express'); // Importation d'Express
const dotenv = require('dotenv'); // Importation de dotenv pour charger les variables d'environnement
const userRoutes = require('./routes/userRoutes'); // Importation des routes utilisateurs

dotenv.config(); // Charger les variables d'environnement

const app = express(); // Création de l'instance Express

app.use(express.json()); // Middleware pour lire les corps de requêtes en JSON

// Routes utilisateurs avec préfixe '/api'
app.use('/api', userRoutes); 

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err);  // Log des erreurs
    res.status(500).json({ message: 'Erreur interne du serveur' });  // Réponse d'erreur générique
});

app.use((req, res, next) => {
    console.log(`Requête reçue : ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 3000; // Définir le port d'écoute
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
