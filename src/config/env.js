require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/food_order_api',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

function assertEnv() {
  if (!env.mongoUri) throw new Error('MONGO_URI is required');
  if (!env.jwtSecret) throw new Error('JWT_SECRET is required');
}

module.exports = { env, assertEnv };
