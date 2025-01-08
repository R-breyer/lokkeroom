const bcrypt = require('bcrypt'); // importer Bcrypt
const jwt = require('jsonwebtoken'); // importer Jsonwebtoken
const db = require('../models/db'); // Connexion à la base de données MySQL

// Fonction d'inscription
const register = async (req, res) => {
    console.log('Requête reçue :', req.body); // Ajoute ce log
    const { email, password, role } = req.body; // On prend en compte le rôle aussi (optionnel)

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        // Vérifier si l'email est déjà utilisé
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.execute(query, [email]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur dans la base de données
        const insertQuery = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        const [insertResults] = await db.execute(insertQuery, [email, hashedPassword, role || 'user']);

        return res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId: insertResults.insertId // Retourner l'ID de l'utilisateur créé
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
};

// Fonction de connexion
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    try {
        // Récupérer l'utilisateur depuis la base de données
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.execute(query, [email]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        const user = results[0]; // L'utilisateur trouvé dans la base

        // Comparer le mot de passe avec celui stocké dans la base de données
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        // Générer un token JWT pour l'utilisateur après une connexion réussie
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Répondre avec le token
        return res.status(200).json({
            message: 'Connexion réussie',
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur du serveur' });
    }
};

module.exports = { register, login }; // Exporter les deux fonctions

