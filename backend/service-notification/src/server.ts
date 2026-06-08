import express, { Express } from 'express';
import { AppConfig } from './config/appConfig';
import httpServer from 'http';
import { Routes } from './routes/routes';
import { Server as SocketServer } from 'socket.io';
import { SocketConnections } from './config/socketConnections';

import 'dotenv/config';

export class Server {
  app: Express;
  server: any;
  ioSocket: any;

  constructor() {
    this.app = express();
    this.server = httpServer.createServer(this.app);
    this.ioSocket = new SocketServer(this.server, {
      cors: {
        origin: '*',
      },
    });
  }

  socketConnection = () => {
    new SocketConnections(this.ioSocket).setSocketConnections();
  };

  appConfig = () => {
    new AppConfig(this.app).includeConfig();
  };

  routesConfig = () => {
    new Routes(this.app).routesConfig();
  };

  start = () => {
    try {
      this.appConfig();
      this.routesConfig();
      this.socketConnection();

      this.server.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
      });
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
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
