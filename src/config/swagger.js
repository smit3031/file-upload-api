const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for my Node.js application',
    },
  },
  apis: [path.resolve(__dirname, '../routes/*.js')], // Adjusted to find the correct path
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('Swagger Docs:', swaggerDocs);

module.exports = { swaggerUi, swaggerDocs };