import { MongoClient } from 'mongodb';

let client: MongoClient;

export const initMongo = async () => {
  const uri = process.env.MONGO_URL || '';

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process on connection failure
  }
};

export const getMongoClient = () => {
  return client;
};

export const closeMongo = async () => {
  if (client) {
    await client.close();
  }
};
