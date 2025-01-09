
 import JWT from 'jsonwebtoken';
 import * as dotenv from 'dotenv';
 dotenv.config();
 
 /**
  * Vérifie si un token JWT valide est présent dans "Authorization: Bearer ..."
  * Si oui, on ajoute req.user = { id, email, role } etc.
  * Sinon, on renvoie une erreur 401 ou 403
  */
 export function authenticateJWT(req, res, next) {
   try {
     // Récupérer l'en-tête Authorization
     const authHeader = req.headers['authorization'];
     if (!authHeader) {
       return res.status(401).json({ message: 'Token manquant' });
     }
 
     // Le header doit être "Bearer <token>"
     const token = authHeader.replace('Bearer ', '');
     if (!token) {
       return res.status(401).json({ message: 'Format de token invalide' });
     }
 
     // Vérifier et décoder le token
     const decoded = JWT.verify(token, process.env.JWT_SECRET);
 
     // Attachons les données du token à la requête
     req.user = decoded; 
 
     next(); // Poursuivre la chaîne (aller au contrôleur suivant)
   } catch (error) {
     console.error(error);
     return res.status(403).json({ message: 'Token invalide ou expiré' });
   }
 }
 