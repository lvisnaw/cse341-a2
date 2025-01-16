require('dotenv').config();
const { MongoClient } = require('mongodb');

let _db; // A variable to store the DB connection once it's established

/**
 * Initializes a single database connection and caches it in `_db`.
 * Calls back with an error if connection fails, or with the db if it succeeds.
 */
const initDb = async (callback) => {
  // If `_db` is already set, database is already initialized
  if (_db) {
    console.log("Db is already initialized!");
    return callback(null, _db);
  }

  try {
    // Create a new MongoClient using the URI from .env
    const client = new MongoClient(process.env.MONGODB_URI);
    
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    _db = client.db("CSE341-A2");

    // Pass the db to the callback to confirm successful initialization
    return callback(null, _db);
  } catch (err) {
    // If there's an error, pass it to the callback
    return callback(err);
  }
};

/**
 * Returns the initialized DB object.
 * Throws an error if `initDb` was never called or failed to initialize the DB.
 */
const getDb = () => {
  if (!_db) {
    throw new Error("Database not initialized");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};