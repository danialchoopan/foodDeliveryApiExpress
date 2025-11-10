const app = require('./app');
const { assertEnv, env } = require('./config/env');
const { connect } = require('./config/db');

(async () => {
  try {
    assertEnv();
    await connect();

    app.listen(env.port, () => {
      console.log(`running at http://localhost:${env.port}`);
    });
  } catch (e) {
    console.error('Failed to start:', e);
    process.exit(1);
  }
})();
