import express from 'express';

import config from './config/constants';
import setupPrometheus from './config/prometheus';
import setupRoutes from './config/routes';

const main = async () => {
  try {
    console.info(
      '🚧 Starting',
      config.NODE_ENV ?? 'development',
      'environment',
    );
    const app = express();
    setupRoutes(app);
    setupPrometheus(app);
    app.listen(config.PORT, '0.0.0.0', () => {
      console.info(`🚀 App running on http://localhost:${config.PORT}`);
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error starting app: ${e.message}`);
      process.exit(1);
    }
  }
};

void main().then(() => {
  process.on('SIGINT', () => {
    process.exit();
  });
});
