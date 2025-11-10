const mongoose = require('mongoose');
const { env } = require('./env');

let isConnected = false;

async function connect() {
  if (isConnected) return mongoose.connection;
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production',
    maxPoolSize: 10
  });

  isConnected = true;

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    isConnected = false;
  });

  return mongoose.connection;
}

module.exports = { connect };
