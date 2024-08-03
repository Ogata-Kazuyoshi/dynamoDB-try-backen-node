import express from 'express';
import controllerIndex from './controller/index.js';

const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use('/api', controllerIndex);
  return app;
};

export { setupServer };
