const app = require('./app');
const { assertEnv, env } = require('./config/env');
const { connect } = require('./config/db');

(async () => {
  try {
    assertEnv();
    await connect().catch(err => {
        console.warn('MongoDB connection failed. App will start but database features may not work:', err.message);
    });

    app.listen(env.port, () => {
      console.log(`FoodGhaza Forosh is running at http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error('Failed to start:', e);
    process.exit(1);
  }
})();
