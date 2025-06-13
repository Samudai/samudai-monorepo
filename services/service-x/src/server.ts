import express, { Express } from 'express';
import { AppConfig } from './config/appConfig';
import { Routes } from './routes/routes';
import { initMongo } from './utils/mongo';
import mqConnection from './config/rabbitmqConfig';
require('dotenv').config();

export class Server {
  app: Express;
  server: any;

  constructor() {
    this.app = express();
  }

  appConfig = () => {
    new AppConfig(this.app).includeConfig();
  };

  routesConfig = () => {
    new Routes(this.app).routesConfig();
  };

  startServer = async () => {
    this.appConfig();

    this.routesConfig();

    await initMongo().then(() => {
      this.server = this.app.listen(process.env.PORT, () => {
        console.log('Service X is running on port', process.env.PORT);
      });
    });
    await mqConnection.connect();
  };

  stopServer = () => {
    process.on('SIGINT', () => {
      console.info('SIGINT signal received.');
      console.log('Closing http server.');
      this.server.close(async () => {
        console.log('Http server closed.');
        process.exit(0);
      });
    });
  };
}
