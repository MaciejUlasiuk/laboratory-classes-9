const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config(); 

const MONGO_URI = process.env.MONGO_URI;
let dbConnection;

const connectToDb = async () => {
  if (dbConnection) {
    return dbConnection;
  }
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not defined in .env file");
  }
  try {
    const client = await MongoClient.connect(MONGO_URI);
    dbConnection = client.db("bookstore"); 
    console.log("Connected to MongoDB ");
    return dbConnection;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

const getDatabase = () => {
  if (!dbConnection) {
    throw new Error('Database not initialized.');
  }
  return dbConnection;
};

module.exports = { connectToDb, getDatabase };