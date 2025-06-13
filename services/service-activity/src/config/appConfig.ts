import bodyParser from 'body-parser';
import cors from 'cors';
import { Express } from 'express';
import morgan from 'morgan';

export class AppConfig {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  setAppConfig = () => {
    this.app.use(bodyParser.json());
    this.app.set('trust proxy', true);
    this.app.use(
      cors({
        credentials: true,
      })
    );
    this.app.use(morgan('short'));
  };

  includeConfig = () => {
    this.setAppConfig();
  };
}
