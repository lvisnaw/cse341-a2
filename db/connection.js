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
    console.log('Database is already initialized!');
    return callback(null, _db);
  }

  try {
    // Ensure the MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    // Create a new MongoClient using the URI from .env
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 200000, // 20 seconds socket timeout
    });

    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB!');

    // Select the database (ensure the name matches your MongoDB setup)
    _db = client.db('contacts'); // Use contacts db
    console.log(`Database selected: ${_db.databaseName}`);

    // Pass the db to the callback to confirm successful initialization
    return callback(null, _db);
  } catch (err) {
    // If there's an error, pass it to the callback
    console.error('Error connecting to MongoDB:', err);
    return callback(err);
  }
};

/**
 * Returns the initialized DB object.
 * Throws an error if `initDb` was never called or failed to initialize the DB.
 */
const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
