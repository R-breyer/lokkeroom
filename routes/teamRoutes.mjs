
 import { Router } from 'express';
 import { authenticateJWT } from '../middlewares/authMiddleware.mjs';
 import { createTeam, addUserToTeam, getTeamMembers } from '../controllers/teamController.mjs';
 
 const router = Router();
 
 // Créer une équipe
 router.post('/teams/create', authenticateJWT, createTeam);
 
 // Ajouter un utilisateur à une équipe
 router.post('/teams/:teamId/add-user', authenticateJWT, addUserToTeam);
 
 // Lister les membres d'une équipe
 router.get('/teams/:teamId/members', authenticateJWT, getTeamMembers);
 
 export default router;
 