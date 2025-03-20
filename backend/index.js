const express = require('express');
const cors = require('cors');
const favoritesRoutes = require('./routes/favorites');
const eventsRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
const setupSwaggerDocs = require('./swagger');

app.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     summary: Returns a simple hello world
 *     responses:
 *       200:
 *         description: Hello World
 */
=======
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/favorites', favoritesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', userRoutes);

// Route par défaut
>>>>>>> 430407c065606a4e254ed049db305cc30701107c
app.get('/', (req, res) => {
  res.json({ message: 'API Favoris Sportifs' });
});
/*
app.get('/api/users', (req, res) => { 

});
*/
setupSwaggerDocs(app);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrer le serveur
app.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
=======
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
>>>>>>> 430407c065606a4e254ed049db305cc30701107c
