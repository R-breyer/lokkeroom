
 import { Router } from 'express';
 import { authenticateJWT } from '../middlewares/authMiddleware.mjs';
 import { createLobby, getLobbyMessages, postMessage } from '../controllers/lobbyController.mjs';
 
 const router = Router();
 
 // Créer un lobby
 router.post('/lobby/create', authenticateJWT, createLobby);
 
 // Récupérer les messages d'un lobby
 router.get('/lobby/:lobbyId/messages', authenticateJWT, getLobbyMessages);
 
 // Poster un message
 router.post('/lobby/:lobbyId/messages', authenticateJWT, postMessage);
 
 export default router;
 