
 import { query } from '../models/db.mjs';
 import bcrypt from 'bcrypt';
 import JWT from 'jsonwebtoken';
 import { promisify } from 'util';
 
 // On rend JWT.sign utilisable en async/await
 const signAsync = promisify(JWT.sign);
 
 /**
  * Inscription d'un nouvel utilisateur
  * POST /api/register
  */
 export async function register(req, res) {
   try {
     // Récupérer l'email, le password et éventuellement le role
     const { email, password, role } = req.body;
 
     if (!email || !password) {
       return res.status(400).json({ message: 'Email et mot de passe requis' });
     }
 
     // Vérifier si l'email existe déjà
     const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
     if (existingUsers.length > 0) {
       return res.status(400).json({ message: 'Cet email est déjà utilisé' });
     }
 
     // Hasher le mot de passe
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Insérer dans la base
     await query(
       'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
       [email, hashedPassword, role || 'user']
     );
 
     return res.status(201).json({ message: 'Utilisateur créé avec succès' });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Erreur serveur' });
   }
 }
 
 /**
  * Connexion (login)
  * POST /api/login
  */
 export async function login(req, res) {
   try {
     const { email, password } = req.body;
 
     if (!email || !password) {
       return res.status(400).json({ message: 'Email et mot de passe requis' });
     }
 
     // Chercher l'utilisateur
     const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
     if (rows.length === 0) {
       return res.status(401).json({ message: 'Utilisateur non trouvé' });
     }
     const user = rows[0];
 
     // Comparer le password en clair avec le hash
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(401).json({ message: 'Mot de passe incorrect' });
     }
 
     // Générer un token JWT
     const token = await signAsync(
       { id: user.id, email: user.email, role: user.role },
       process.env.JWT_SECRET,
       { expiresIn: '1h' }
     );
 
     return res.status(200).json({
       message: 'Connexion réussie',
       token
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Erreur serveur' });
   }
 }
 