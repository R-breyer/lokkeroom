/************************************
 * server.mjs
 ************************************/
 import express from 'express';       // Le framework web
 import cors from 'cors';            // Gérer CORS
 import * as dotenv from 'dotenv';    // Pour charger .env
 
 // Charger les variables d'environnement
 dotenv.config();
 
 // Importer les routes
 import authRoutes from './routes/authRoutes.mjs';
 import lobbyRoutes from './routes/lobbyRoutes.mjs';
 import teamRoutes from './routes/teamRoutes.mjs'; // Pour la gestion des teams
 
 // Créer l'application Express
 const app = express();
 
 // Permettre la lecture du JSON envoyé dans le body
 app.use(express.json());
 
 // Autoriser CORS par défaut
 app.use(cors());
 
 // Monter les routes avec un préfixe "/api" (optionnel)
 app.use('/api', authRoutes);
 app.use('/api', lobbyRoutes);
 app.use('/api', teamRoutes);
 
 // Récupération du port
 const PORT = process.env.PORT || 3000;
 
 // Lancer le serveur
 app.listen(PORT, () => {
   console.log(`Serveur démarré sur http://localhost:${PORT}`);
 });
 