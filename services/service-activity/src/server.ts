import express, { Express } from 'express';
import mongoose from 'mongoose';
import { AppConfig } from './config/appConfig';
import { Routes } from './routes/routes';
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

  startServer = () => {
    this.appConfig();

    this.routesConfig();

    mongoose.connect(process.env.MONGO_URL || '').then(() => {
      console.log('Database is connected');
      this.server = this.app.listen(process.env.PORT, () => {
        console.log('Activity service is running on port', process.env.PORT);
      });
    });
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
