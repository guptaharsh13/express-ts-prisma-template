import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './constants';

const setupRoutes = (app: Express) => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan(config.NODE_ENV === 'production' ? 'common' : 'dev'));
  app.use(express.json());

  app.all('/', (_: Request, res: Response) => {
    res.send({ app: 'up and running 🚀' });
  });
};

export default setupRoutes;
