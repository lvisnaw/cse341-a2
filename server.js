const express = require('express');
const { initDb } = require('./db/connection');
const routes = require('./routes'); // Keep this for the existing routes
const contactsRouter = require('./routes/contacts'); // Add this for contacts routes
const setupSwagger = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

setupSwagger(app);

// Initialize the DB, then start the server
initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if DB connection fails
  } else {
    // If connected successfully, attach routes
    app.use('/', routes); // Existing routes
    app.use('/api/contacts', contactsRouter); // New contacts API routes

    // Start listening—this keeps Node running
    app.listen(port, () => {
      console.log(
        `Web Server is listening on port ${port} http://localhost:3000/`
      );
    });
  }
});
