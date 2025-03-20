const express = require('express');
const { readJsonFile } = require('../utils');
const router = express.Router();

/**
 * @route GET /api/favorites/:userId
 * @desc Récupérer tous les favoris d'un utilisateur
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Chargement des données nécessaires
  const favorites = readJsonFile('favorites.json');
  const sports = readJsonFile('sports.json');
  const teams = readJsonFile('teams.json');
  const persons = readJsonFile('persons.json');
  const leagues = readJsonFile('leagues.json');
  
  if (!favorites) {
    return res.status(500).json({ error: 'Erreur lors du chargement des données des favoris' });
  }
  
  // Vérifier si l'utilisateur existe
  if (favorites.userId !== userId) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  // Créer un objet pour contenir les informations détaillées des favoris
  const userFavorites = {
    userId,
    sports: [],
    teams: [],
    players: []
  };
  
  // Traiter chaque favori
  favorites.favorites.forEach(favorite => {
    switch (favorite.type) {
      case 'sport':
        const sport = sports.find(s => s.id === favorite.id);
        if (sport) {
          userFavorites.sports.push({
            id: sport.id,
            name: sport.name
          });
        }
        break;
      case 'team':
        const team = teams.find(t => t.id === favorite.id);
        if (team) {
          const sportInfo = sports.find(s => s.id === team.sport);
          const leagueInfo = leagues.find(l => l.id === team.league);
          userFavorites.teams.push({
            id: team.id,
            name: team.name,
            sport: sportInfo ? sportInfo.name : null,
            league: leagueInfo ? leagueInfo.name : null
          });
        }
        break;
      case 'player':
        const player = persons.find(p => p.id === favorite.id);
        if (player) {
          const sportInfo = sports.find(s => s.id === player.sport);
          userFavorites.players.push({
            id: player.id,
            name: player.name,
            sport: sportInfo ? sportInfo.name : null,
            nationality: player.nationality,
            ranking: player.ranking
          });
        }
        break;
    }
  });
  
  res.json(userFavorites);
});

/**
 * @route GET /api/favorites/:userId/sports
 * @desc Récupérer les sports favoris d'un utilisateur
 */
router.get('/:userId/sports', (req, res) => {
  const { userId } = req.params;
  
  const favorites = readJsonFile('favorites.json');
  const sports = readJsonFile('sports.json');
  
  if (!favorites || !sports) {
    return res.status(500).json({ error: 'Erreur lors du chargement des données' });
  }
  
  if (favorites.userId !== userId) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const favoriteSports = favorites.favorites
    .filter(fav => fav.type === 'sport')
    .map(fav => {
      const sport = sports.find(s => s.id === fav.id);
      return sport ? { id: sport.id, name: sport.name } : null;
    })
    .filter(Boolean); // Filtrer les éléments null
  
  res.json(favoriteSports);
});

/**
 * @route GET /api/favorites/:userId/teams
 * @desc Récupérer les équipes favorites d'un utilisateur
 */
router.get('/:userId/teams', (req, res) => {
  const { userId } = req.params;
  
  const favorites = readJsonFile('favorites.json');
  const teams = readJsonFile('teams.json');
  const sports = readJsonFile('sports.json');
  const leagues = readJsonFile('leagues.json');
  
  if (!favorites || !teams) {
    return res.status(500).json({ error: 'Erreur lors du chargement des données' });
  }
  
  if (favorites.userId !== userId) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const favoriteTeams = favorites.favorites
    .filter(fav => fav.type === 'team')
    .map(fav => {
      const team = teams.find(t => t.id === fav.id);
      if (!team) return null;
      
      const sportInfo = sports ? sports.find(s => s.id === team.sport) : null;
      const leagueInfo = leagues ? leagues.find(l => l.id === team.league) : null;
      
      return {
        id: team.id,
        name: team.name,
        sport: sportInfo ? sportInfo.name : null,
        league: leagueInfo ? leagueInfo.name : null
      };
    })
    .filter(Boolean);
  
  res.json(favoriteTeams);
});

/**
 * @route GET /api/favorites/:userId/players
 * @desc Récupérer les joueurs favoris d'un utilisateur
 */
router.get('/:userId/players', (req, res) => {
  const { userId } = req.params;
  
  const favorites = readJsonFile('favorites.json');
  const persons = readJsonFile('persons.json');
  const sports = readJsonFile('sports.json');
  
  if (!favorites || !persons) {
    return res.status(500).json({ error: 'Erreur lors du chargement des données' });
  }
  
  if (favorites.userId !== userId) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  const favoritePlayers = favorites.favorites
    .filter(fav => fav.type === 'player')
    .map(fav => {
      const player = persons.find(p => p.id === fav.id);
      if (!player) return null;
      
      const sportInfo = sports ? sports.find(s => s.id === player.sport) : null;
      
      return {
        id: player.id,
        name: player.name,
        sport: sportInfo ? sportInfo.name : null,
        nationality: player.nationality,
        ranking: player.ranking
      };
    })
    .filter(Boolean);
  
  res.json(favoritePlayers);
});

module.exports = router;