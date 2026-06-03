require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/food_order_api',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

const assertEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  // Simplified for demo, just log warnings
  required.forEach(key => {
    if (!process.env[key]) console.warn(`Warning: Environment variable ${key} is missing.`);
  });
};

module.exports = { env, assertEnv };
