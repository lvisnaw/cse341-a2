require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const testConnection = async () => {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB!');
    await client.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

testConnection();
