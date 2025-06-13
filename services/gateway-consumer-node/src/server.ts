import express, { Express } from 'express';
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

    routeConfig = () => {
        new Routes(this.app).routesConfig();
    };

    startServer = async () => {
        try {
            this.appConfig();
            this.routeConfig();
            this.server = this.app.listen(process.env.PORT, () => {
                console.log('Gateway consumer is running on port', process.env.PORT);
            });
        } catch (err) {
            console.error(err);
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
