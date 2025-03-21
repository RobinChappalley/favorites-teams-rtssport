const express = require('express');
const { readJsonFile } = require('../utils');

const router = express.Router();

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Retrieve user information
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information
 *       404:
 *         description: User not found
 *       500:
 *         description: Error loading users
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const users = readJsonFile('users.json');

  if (!users) {
    return res.status(500).json({ error: 'Erreur lors du chargement des utilisateurs' });
  }

  // Si users est un objet unique et non un tableau
  if (!Array.isArray(users)) {
    if (users.id === userId) {
      return res.json(users);
    }
  } else {
    // Si users est un tableau
    const user = users.find(u => u.id === userId);
    if (user) {
      return res.json(user);
    }
  }

  return res.status(404).json({ error: 'Utilisateur non trouvé' });
});

/**
 * @openapi
 * /api/users/{userId}/feed:
 *   get:
 *     summary: Retrieve a user's personalized feed
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User feed
 *       404:
 *         description: User feed not found
 *       500:
 *         description: Error loading user feed
 */
router.get('/:userId/feed', (req, res) => {
  const { userId } = req.params;

  const userFeed = readJsonFile('user_feed.json');

  if (!userFeed) {
    return res.status(500).json({ error: 'Erreur lors du chargement du feed utilisateur' });
  }

  if (userFeed.userId !== userId) {
    return res.status(404).json({ error: 'Feed utilisateur non trouvé' });
  }

  res.json(userFeed);
});

/**
 * @openapi
 * /api/users/{userId}/favorites/events:
 *   get:
 *     summary: Retrieve a user's favorite events with detailed information
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of favorite events with detailed info
 *       404:
 *         description: User not found
 *       500:
 *         description: Error loading data
 */
router.get('/:userId/favorites/events', (req, res) => {
  const { userId } = req.params;

  // Charger les données nécessaires
  const favorites = readJsonFile('favorites.json');
  const events = readJsonFile('events.json');
  const broadcasts = readJsonFile('broadcast.json');
  const sports = readJsonFile('sports.json');
  const teams = readJsonFile('teams.json');
  const persons = readJsonFile('persons.json');
  const leagues = readJsonFile('leagues.json');

  if (!favorites || !events) {
    return res.status(500).json({ error: 'Erreur lors du chargement des données' });
  }

  if (favorites.userId !== userId) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }

  // Récupérer les IDs des favoris par type
  const favoriteSportIds = favorites.favorites
    .filter(fav => fav.type === 'sport')
    .map(fav => fav.id);

  const favoriteTeamIds = favorites.favorites
    .filter(fav => fav.type === 'team')
    .map(fav => fav.id);

  const favoritePlayerIds = favorites.favorites
    .filter(fav => fav.type === 'player')
    .map(fav => fav.id);

  // Filtrer les événements liés aux favoris
  const favoriteEvents = events.filter(event => {
    // Vérifier si l'événement est lié à un sport favori
    const isFavoriteSport = event.sport && favoriteSportIds.includes(event.sport.id);

    // Vérifier si l'événement est lié à une équipe favorite
    const isFavoriteTeam =
      event.participants && event.participants.some(participant =>
        favoriteTeamIds.includes(participant.id)
      );

    // Vérifier si l'événement est lié à un joueur favori
    const isFavoritePlayer =
      event.participants && event.participants.some(participant =>
        favoritePlayerIds.includes(participant.id)
      );

    return isFavoriteSport || isFavoriteTeam || isFavoritePlayer;
  });

  // Enrichir les événements avec des informations détaillées
  const enrichedEvents = favoriteEvents.map(event => {
    // Trouver les informations de diffusion
    const broadcast = broadcasts ? broadcasts.find(b => b.eventId === event.id) : null;

    // Enrichir les informations du sport
    let sportInfo = null;
    if (event.sport && sports) {
      const sport = sports.find(s => s.id === event.sport.id);
      if (sport) {
        sportInfo = {
          id: sport.id,
          name: sport.name
        };
      }
    }

    // Enrichir les informations de la ligue ou du tournoi
    let leagueInfo = null;
    if (event.league && leagues) {
      const league = leagues.find(l => l.id === event.league.id);
      if (league) {
        leagueInfo = {
          id: league.id,
          name: league.name,
          country: league.country
        };
      }
    }

    // Enrichir les informations des participants
    let participantsInfo = [];
    if (event.participants) {
      participantsInfo = event.participants.map(participant => {
        if (participant.id.startsWith('team_') && teams) {
          const team = teams.find(t => t.id === participant.id);
          return {
            id: participant.id,
            name: team ? team.name : null,
            role: participant.role,
            type: 'team',
            isFavorite: favoriteTeamIds.includes(participant.id)
          };
        } else if (participant.id.startsWith('player_') && persons) {
          const player = persons.find(p => p.id === participant.id);
          return {
            id: participant.id,
            name: player ? player.name : null,
            role: participant.role,
            type: 'player',
            nationality: player ? player.nationality : null,
            ranking: player ? player.ranking : null,
            isFavorite: favoritePlayerIds.includes(participant.id)
          };
        }
        return participant;
      });
    }

    // Déterminer pourquoi l'événement est favori
    const isFavoriteSport = event.sport && favoriteSportIds.includes(event.sport.id);
    const isFavoriteTeam =
      event.participants && event.participants.some(participant =>
        favoriteTeamIds.includes(participant.id)
      );
    const isFavoritePlayer =
      event.participants && event.participants.some(participant =>
        favoritePlayerIds.includes(participant.id)
      );

    const favoriteReasons = [];
    if (isFavoriteSport) favoriteReasons.push('Sport favori');
    if (isFavoriteTeam) favoriteReasons.push('Équipe favorite');
    if (isFavoritePlayer) favoriteReasons.push('Joueur favori');

    return {
      id: event.id,
      name: event.name,
      datetime: event.datetime,
      status: event.status,
      venue: event.venue,
      sport: sportInfo,
      league: leagueInfo,
      tournament: event.tournament,
      participants: participantsInfo,
      broadcast: broadcast
        ? {
            provider: broadcast.providerId,
            channel: broadcast.channel,
            startTime: broadcast.startTime,
            endTime: broadcast.endTime,
            liveUrl: broadcast.liveUrl
          }
        : null,
      favoriteReasons,
      isFavoriteSport,
      isFavoriteTeam,
      isFavoritePlayer
    };
  });

  // Trier les événements par date
  enrichedEvents.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  res.json(enrichedEvents);
});

module.exports = router;
