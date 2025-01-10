import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware.mjs';
import {
  createLobby,
  getLobbyMessages,
  postMessage,
  editMessage,  
  deleteMessage
} from '../controllers/lobbyController.mjs';

const router = Router();

// Créer un lobby
router.post('/lobby/create', authenticateJWT, createLobby);

// Récupérer les messages d’un lobby
router.get('/lobby/:lobbyId/messages', authenticateJWT, getLobbyMessages);

// Poster un message dans le lobby
router.post('/lobby/:lobbyId/messages', authenticateJWT, postMessage);

// Éditer un message (PATCH)
router.patch('/lobby/:lobbyId/messages/:messageId', authenticateJWT, editMessage);

// delete un message
router.delete('/lobby/:lobbyId/messages/:messageId', authenticateJWT, deleteMessage);


export default router;

 