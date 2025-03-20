# API des Favoris Sportifs

Cette API gère les favoris sportifs et les événements associés, permettant aux utilisateurs de consulter leurs sports, équipes et joueurs favoris ainsi que les événements à venir.

## Structure du projet

```
- index.js               # Point d'entrée de l'application
- utils.js               # Fonctions utilitaires
- routes/                # Dossier contenant les routes
  - favorites.js         # Routes pour les favoris
  - events.js            # Routes pour les événements
  - users.js             # Routes pour les utilisateurs
- data/                  # Dossier contenant les données JSON
  - broadcast.json
  - events.json
  - favorites.json
  - leagues.json
  - persons.json
  - providers.json
  - sports.json
  - teams.json
  - user_feed.json
  - users.json
```

## Installation et démarrage

1. Installez les dépendances:
```bash
npm install express cors
```

2. Démarrez le serveur:
```bash
node index.js
```

Le serveur sera disponible sur http://localhost:3000

## API Endpoints

### Favoris

- **GET /api/favorites/:userId** - Récupérer tous les favoris d'un utilisateur
- **GET /api/favorites/:userId/sports** - Récupérer les sports favoris d'un utilisateur
- **GET /api/favorites/:userId/teams** - Récupérer les équipes favorites d'un utilisateur
- **GET /api/favorites/:userId/players** - Récupérer les joueurs favoris d'un utilisateur

### Événements

- **GET /api/events** - Récupérer tous les événements
- **GET /api/events/:eventId** - Récupérer les détails d'un événement spécifique
- **GET /api/events/sport/:sportId** - Récupérer les événements par sport
- **GET /api/events/favorite/:userId** - Récupérer les événements liés aux favoris d'un utilisateur

### Utilisateurs

- **GET /api/users/:userId** - Récupérer les informations d'un utilisateur
- **GET /api/users/:userId/feed** - Récupérer le feed personnalisé d'un utilisateur
- **GET /api/users/:userId/favorites/events** - Récupérer les événements favoris d'un utilisateur avec détails

## Exemple d'utilisation

### Récupérer les favoris d'un utilisateur

```javascript
fetch('http://localhost:3000/api/favorites/user123')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));
```

### Récupérer les événements favoris avec détails

```javascript
fetch('http://localhost:3000/api/users/user123/favorites/events')
  .then(response => response.json())
  .then(events => {
    // Traitement des événements
    events.forEach(event => {
      console.log(`Événement: ${event.name}, Date: ${event.datetime}`);
      console.log(`Raisons favorites: ${event.favoriteReasons.join(', ')}`);
    });
  })
  .catch(error => console.error('Erreur:', error));
```

## Formats de réponse

### Format de réponse pour les favoris d'un utilisateur

```json
{
  "userId": "user123",
  "sports": [
    {
      "id": "sport_f1",
      "name": "F1"
    },
    {
      "id": "sport_football",
      "name": "Football"
    }
  ],
  "teams": [
    {
      "id": "team_servette",
      "name": "Servette",
      "sport": "Football",
      "league": "Super League"
    }
  ],
  "players": [
    {
      "id": "player_doraeve",
      "name": "Doraeve",
      "sport": "Tennis",
      "nationality": "Suisse",
      "ranking": 12
    }
  ]
}
```

### Format de réponse pour les événements favoris

```json
[
  {
    "id": "event_football_servette_lugano",
    "name":