const jwt = require('jsonwebtoken');  // Importer le package jsonwebtoken

// Middleware pour vérifier le token JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Récupérer le token de l'en-tête Authorization

    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {  // Vérifier la validité du token avec la clé secrète
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }

        req.user = user;  // Ajouter l'utilisateur à la requête pour l'utiliser dans les prochaines étapes
        next();  // Passer au middleware suivant
    });
};

module.exports = authenticateJWT;  // Exporter le middleware
