const express = require('express');
const cors = require('cors');
const favoritesRoutes = require('./routes/favorites');
const eventsRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');
const userRoutes = require('./routes/user');
const connectDB = require('./db');

const app = express();


const PORT = process.env.PORT || 3000;

const setupSwaggerDocs = require('./swagger');


// Connect to MongoDB
connectDB()
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/favorites', favoritesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/user', userRoutes);

// Route par défaut
/**
 * @openapi
 * /:
 *   get:
 *     summary: Returns a simple message
 *     responses:
 *       200:
 *         description: API description
 */
app.get('/', (req, res) => {
  res.json({ message: 'API Favoris Sportifs' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Swagger
setupSwaggerDocs(app);
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;