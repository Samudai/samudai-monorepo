import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';

export class AppConfig {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  setAppConfig = () => {
    this.app.use(express.json());
    this.app.set('trust proxy', true);
    this.app.use(
      cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,CONNECT',
      })
    );
    this.app.use(morgan('dev'));
  };

  includeConfig = () => {
    this.setAppConfig();
  };
}
