const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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
app.get('/', (req, res) => {
    res.send('Hello World!');
});
/*
app.get('/api/users', (req, res) => { 

});
*/
setupSwaggerDocs(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});