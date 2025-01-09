import { query } from '../models/db.mjs';

/**
 * Créer un lobby
 * POST /api/lobby/create
 * Nécessite un token JWT (pour savoir qui est l'admin)
 */
export async function createLobby(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom du lobby est requis' });
    }

    const adminId = req.user.id; // utilisateur connecté (middleware JWT)

    // Vérifier si un lobby du même nom existe déjà
    const existing = await query('SELECT id FROM lobbies WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ce lobby existe déjà' });
    }

    // Insérer le lobby
    const result = await query(
      'INSERT INTO lobbies (name, admin_id) VALUES (?, ?)',
      [name, adminId]
    );

    // Convertir le BigInt en nombre (ou en chaîne : toString())
    const lobbyId = Number(result.insertId);

    // Optionnel : ajouter automatiquement l’admin dans user_lobbies
    await query(
      'INSERT INTO user_lobbies (user_id, lobby_id) VALUES (?, ?)',
      [adminId, lobbyId]
    );

    return res.status(201).json({
      message: 'Lobby créé avec succès',
      lobbyId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Récupérer les messages d'un lobby
 * GET /api/lobby/:lobbyId/messages
 */
export async function getLobbyMessages(req, res) {
  try {
    const { lobbyId } = req.params;

    // (Optionnel) vérifier que req.user.id est dans user_lobbies pour ce lobbyId

    // Récupérer les messages
    const messages = await query(
      `SELECT m.id, m.content, m.created_at, u.email AS authorEmail
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.lobby_id = ?
       ORDER BY m.created_at ASC`,
      [lobbyId]
    );

    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Poster un message dans un lobby
 * POST /api/lobby/:lobbyId/messages
 */
export async function postMessage(req, res) {
  try {
    const { lobbyId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Le contenu du message est requis' });
    }

    const userId = req.user.id;

    // Vérifier éventuellement si (userId, lobbyId) existe dans user_lobbies

    await query(
      'INSERT INTO messages (content, user_id, lobby_id) VALUES (?, ?, ?)',
      [content, userId, lobbyId]
    );

    return res.status(201).json({ message: 'Message créé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
