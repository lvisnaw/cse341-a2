// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Contacts API',
//       version: '1.0.0',
//       description: 'API for managing contacts',
//     },
//   },
//   apis: ['./routes/*.js'], // Adjust the path if necessary
// };

// // Initialize Swagger
// const specs = swaggerJsdoc(options);

// const setupSwagger = (app) => {
//   app.use('/api-docs', (req, res, next) => {
//     const protocol = req.headers['x-forwarded-proto'] || req.protocol; // Detect HTTP or HTTPS
//     const host = req.headers.host; // Get the current domain name

//     const servers = [
//       {
//         url: `${protocol}://${host}`, // Dynamically set the correct base URL
//         description: host.includes('localhost') ? 'Local development server' : 'Live API on Render',
//       },
//     ];

//     // Attach dynamic servers to Swagger definition
//     specs.servers = servers;
//     next();
//   });

//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// };

// module.exports = setupSwagger;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
  },
  apis: ['./routes/*.js'], // Adjust this path if necessary
};

// Initialize Swagger specs
const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', (req, res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the current domain name

    // ✅ Dynamically determine the server environment description
    const environment = host.includes('localhost')
      ? 'Local development server'
      : `Live API (${host})`; // Show the actual live host dynamically

    // ✅ Ensure the `servers` array is dynamically updated
    specs.servers = [
      {
        url: `${protocol}://${host}`, // Auto-detects the correct URL
        description: environment, // ✅ Adds back the environment description
      },
    ];

    next();
  });

  // ✅ Serve Swagger UI after updating `specs.servers`
  app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
    swaggerUi.setup(specs)(req, res, next);
  });
};

module.exports = setupSwagger;
