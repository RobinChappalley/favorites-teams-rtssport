const express = require('express');
const cors = require('cors');
const favoritesRoutes = require('./routes/favorites');
const eventsRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/favorites', favoritesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', userRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API Favoris Sportifs' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;