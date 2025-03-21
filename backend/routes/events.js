const express = require('express');
const { readJsonFile } = require('../utils');

const router = express.Router();

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Retrieve all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of all events
 *       500:
 *         description: Error loading events
 */
router.get('/', (req, res) => {
  const events = readJsonFile('events.json');

  if (!events) {
    return res.status(500).json({ error: 'Erreur lors du chargement des événements' });
  }

  res.json(events);
});

/**
 * @openapi
 * /api/events/{eventId}:
 *   get:
 *     summary: Retrieve the details of a specific event
 *     tags:
 *       - Events
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Error loading events
 */
router.get('/:eventId', (req, res) => {
  const { eventId } = req.params;

  const events = readJsonFile('events.json');
  const broadcasts = readJsonFile('broadcast.json');
  const teams = readJsonFile('teams.json');
  const persons = readJsonFile('persons.json');

  if (!events) {
    return res.status(500).json({ error: 'Erreur lors du chargement des événements' });
  }

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Événement non trouvé' });
  }

  // Trouver les informations de diffusion
  const broadcast = broadcasts ? broadcasts.find(b => b.eventId === eventId) : null;

  // Ajouter les détails des participants (équipes ou joueurs) si disponibles
  let participants = [];
  if (event.participants) {
    participants = event.participants.map(participant => {
      if (participant.id.startsWith('team_') && teams) {
        const team = teams.find(t => t.id === participant.id);
        return {
          id: participant.id,
          name: team ? team.name : null,
          role: participant.role,
          type: 'team'
        };
      } else if (participant.id.startsWith('player_') && persons) {
        const player = persons.find(p => p.id === participant.id);
        return {
          id: participant.id,
          name: player ? player.name : null,
          role: participant.role,
          type: 'player',
          nationality: player ? player.nationality : null,
          ranking: player ? player.ranking : null
        };
      }
      return participant;
    });
  }

  const eventDetails = {
    ...event,
    participants,
    broadcast: broadcast
      ? {
          provider: broadcast.providerId,
          channel: broadcast.channel,
          startTime: broadcast.startTime,
          endTime: broadcast.endTime,
          liveUrl: broadcast.liveUrl
        }
      : null
  };

  res.json(eventDetails);
});

/**
 * @openapi
 * /api/events/sport/{sportId}:
 *   get:
 *     summary: Retrieve events by sport
 *     tags:
 *       - Events
 *     parameters:
 *       - name: sportId
 *         in: path
 *         required: true
 *         description: The ID of the sport
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events for this sport
 *       500:
 *         description: Error loading events
 */
router.get('/sport/:sportId', (req, res) => {
  const { sportId } = req.params;

  const events = readJsonFile('events.json');

  if (!events) {
    return res.status(500).json({ error: 'Erreur lors du chargement des événements' });
  }

  const filteredEvents = events.filter(
    event => event.sport && event.sport.id === sportId
  );

  res.json(filteredEvents);
});

/**
 * @openapi
 * /api/events/favorite/{userId}:
 *   get:
 *     summary: Retrieve events related to a user's favorites
 *     tags:
 *       - Events
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events related to the user's favorites
 *       404:
 *         description: User not found
 *       500:
 *         description: Error loading data
 */
router.get('/favorite/:userId', (req, res) => {
  const { userId } = req.params;

  // Charger les données nécessaires
  const favorites = readJsonFile('favorites.json');
  const events = readJsonFile('events.json');
  const broadcasts = readJsonFile('broadcast.json');

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
    const isFavoriteSport = event.sport && favoriteSportIds.includes(event.sport.id);

    const isFavoriteTeam =
      event.participants &&
      event.participants.some(participant => favoriteTeamIds.includes(participant.id));

    const isFavoritePlayer =
      event.participants &&
      event.participants.some(participant => favoritePlayerIds.includes(participant.id));

    return isFavoriteSport || isFavoriteTeam || isFavoritePlayer;
  });

  // Ajouter les informations de diffusion et les raisons du statut de favori
  const enrichedEvents = favoriteEvents.map(event => {
    // Trouver les informations de diffusion
    const broadcast = broadcasts ? broadcasts.find(b => b.eventId === event.id) : null;

    // Déterminer pourquoi l'événement est favori
    const isFavoriteSport = event.sport && favoriteSportIds.includes(event.sport.id);
    const isFavoriteTeam =
      event.participants &&
      event.participants.some(participant => favoriteTeamIds.includes(participant.id));
    const isFavoritePlayer =
      event.participants &&
      event.participants.some(participant => favoritePlayerIds.includes(participant.id));

    return {
      ...event,
      broadcast: broadcast
        ? {
            provider: broadcast.providerId,
            channel: broadcast.channel,
            startTime: broadcast.startTime,
            endTime: broadcast.endTime,
            liveUrl: broadcast.liveUrl
          }
        : null,
      favoriteReasons: {
        isFavoriteSport,
        isFavoriteTeam,
        isFavoritePlayer
      }
    };
  });

  // Trier les événements par date
  enrichedEvents.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  res.json(enrichedEvents);
});

module.exports = router;
