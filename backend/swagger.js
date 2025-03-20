const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Basic metadata for your API
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Sport checker',
    version: '1.0.0',
    description: 'API Documentation',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Update this if you use a different port
    },
  ],
};

// Where to look for documentation comments.
// You can include multiple files or folders with glob patterns.
const options = {
  swaggerDefinition,
  apis: ['./index.js', './routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

// A simple function to set up Swagger in your Express app
function setupSwaggerDocs(app) {
  // The docs will be available at http://localhost:3000/api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwaggerDocs;