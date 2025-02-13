// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Contacts API',
//       version: '1.0.0',
//       description: 'API documentation for managing contacts',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000', // Change this to your Render URL when deployed
//         description: 'Local development server',
//       },
//     ],
//   },
//   apis: ['./routes/*.js'], // Path to API route files
// };

// const swaggerSpec = swaggerJSDoc(options);

// const setupSwagger = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   console.log('Swagger docs available at http://localhost:3000/api-docs');
// };

// module.exports = setupSwagger;

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const isLocal = process.env.NODE_ENV !== 'production'; // Check if in local dev mode
// const serverUrl = isLocal ? 'http://localhost:3000' : 'https://cse341-a2-lesson6.onrender.com'; // Use Render in production

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Contacts API',
//       version: '1.0.0',
//       description: 'API documentation for managing contacts',
//     },
//     servers: [
//       {
//         url: serverUrl, // Dynamically select the server
//         description: isLocal ? 'Local development server' : 'Production server',
//       },
//     ],
//   },
//   apis: ['./routes/*.js'], // Path to API route files
// };

// const swaggerSpec = swaggerJSDoc(options);

// const setupSwagger = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//   console.log(`Swagger docs available at ${serverUrl}/api-docs`);
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
  apis: ['./routes/*.js'], // Adjust the path if necessary
};

// Initialize Swagger
const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', (req, res, next) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol; // Detect HTTP or HTTPS
    const host = req.headers.host; // Get the current domain name

    const servers = [
      {
        url: `${protocol}://${host}`, // Dynamically set the correct base URL
        description: host.includes('localhost') ? 'Local development server' : 'Live API on Render',
      },
    ];

    // Attach dynamic servers to Swagger definition
    specs.servers = servers;
    next();
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
