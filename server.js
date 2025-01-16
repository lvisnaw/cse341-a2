const express = require("express");
const { initDb } = require("./db/connection");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

// Initialize the DB, then start the server
initDb((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit if DB connection fails
  } else {
    // If connected successfully, attach routes
    app.use("/", routes);

    // Start listening—this keeps Node running
    app.listen(port, () => {
      console.log(`Web Server is listening on port ${port}`);
    });
  }
});
