import { query } from '../models/db.mjs';

/**
 * Créer une équipe
 * POST /api/teams/create
 */
export async function createTeam(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Le nom de l\'équipe est requis' });
    }

    // Vérifier si elle existe déjà (optionnel)
    const existing = await query('SELECT id FROM teams WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Cette équipe existe déjà' });
    }

    // Insérer l'équipe
    const result = await query(
      'INSERT INTO teams (name) VALUES (?)',
      [name]
    );

    // Convertir le BigInt en nombre (ou en string)
    const teamId = Number(result.insertId);
    // ou : const teamId = result.insertId.toString();

    return res.status(201).json({
      message: 'Équipe créée avec succès',
      teamId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Ajouter un utilisateur à une équipe
 * POST /api/teams/:teamId/add-user
 * Body: { userId, role }
 */
export async function addUserToTeam(req, res) {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body; // role = 'player' ou 'coach'

    // Vérifier existence de l'équipe
    const teams = await query('SELECT id FROM teams WHERE id = ?', [teamId]);
    if (teams.length === 0) {
      return res.status(404).json({ message: 'Équipe introuvable' });
    }

    // Vérifier existence de l'utilisateur
    const users = await query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Vérifier si l'utilisateur est déjà dans l'équipe
    const existing = await query(
      'SELECT * FROM user_teams WHERE user_id = ? AND team_id = ?',
      [userId, teamId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Utilisateur déjà dans l\'équipe' });
    }

    // Insérer la relation dans `user_teams`
    await query(
      'INSERT INTO user_teams (user_id, team_id, role) VALUES (?, ?, ?)',
      [userId, teamId, role || 'player']
    );

    return res.status(201).json({ message: 'Utilisateur ajouté à l\'équipe' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}

/**
 * Lister les membres d'une équipe
 * GET /api/teams/:teamId/members
 */
export async function getTeamMembers(req, res) {
  try {
    const { teamId } = req.params;

    // Vérifier l'équipe
    const teams = await query('SELECT id FROM teams WHERE id = ?', [teamId]);
    if (teams.length === 0) {
      return res.status(404).json({ message: 'Équipe introuvable' });
    }

    // Récupérer la liste des membres
    const members = await query(
      `SELECT ut.user_id, ut.role, u.email
       FROM user_teams ut
       JOIN users u ON ut.user_id = u.id
       WHERE ut.team_id = ?`,
      [teamId]
    );

    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
}
