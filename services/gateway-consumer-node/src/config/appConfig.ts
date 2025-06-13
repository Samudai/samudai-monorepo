import express, { Express } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import fileUpload from 'express-fileupload';
import timeout from 'connect-timeout';
import { timeoutHandler } from '../middlewares/timeoutHandler';
export class AppConfig {
    app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    setAppConfig = () => {
        // this.app.use(timeout('5s'));
        // this.app.use(timeoutHandler);
        // this.app.use(json({limit : '10mb'}));
        this.app.set('view engine', 'ejs');
        this.app.set('views', './src/views');
        this.app.use((req, res, next) => {
            if (req.originalUrl === '/api/stripe/webhook') {
                console.log(req.originalUrl);
                next();
            } else {
                express.json({ limit: '10mb' })(req, res, next);
            }
        });

        this.app.set('trust proxy', true);
        //this.app.use(cookieParser());
        this.app.use(
            cookieSession({
                signed: false,
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            })
        );
        var origin;
        switch (process.env.ENVIRONMENT) {
            case 'dev':
                origin = [
                    'http://dev.samudai.xyz', //dev
                    'https://dev.samudai.xyz', //dev
                    'http://localhost:3001', //stage, dev, prod
                    'http://localhost:3000', //stage, dev, prod
                    'https://samudai.xyz', //prod, dev, stage
                    'http://samudai.xyz', //prod, dev, stage
                    'https://dev-parcel.samudai.xyz', //stage, dev, prod
                    'https://dev-gcn.samudai.xyz/',
                    'https://samudai-app-view.web.app/', //stage, dev
                    'chrome-extension://aiipihanfbemhegopmlekpccbeojgfgk',
                    'chrome-extension://hhgjpkmpogpkbkbhhmdhpcfcljdeegab',
                    'https://dev.points.samudai.xyz',
                    'http://dev.points.samudai.xyz',
                ];
                break;
            case 'stage':
                origin = [
                    'http://stage.samudai.xyz', //stage
                    'https://stage.samudai.xyz', //stage
                    'https://samudai.xyz', //prod, dev, stage
                    'http://samudai.xyz', //prod, dev, stage
                    'https://dev-parcel.samudai.xyz', //stage, dev, prod
                    'https://samudai-app-view.web.app/', //stage, dev
                    'http://localhost:3001', //stage, dev, prod
                    'http://localhost:3000', //stage, dev, prod
                    'chrome-extension://aiipihanfbemhegopmlekpccbeojgfgk',
                    'https://stage-gcn.samudai.xyz',
                    'https://stage.points.samudai.xyz',
                    'http://stage.points.samudai.xyz',
                ];
                break;
            case 'prod':
                origin = [
                    'http://app.samudai.xyz', //prod
                    'https://app.samudai.xyz', //prod
                    'https://samudai.xyz', //prod, dev, stage
                    'http://samudai.xyz', //prod, dev, stage
                    'https://dev-parcel.samudai.xyz', //stage, dev, prod
                    'http://localhost:3001', //stage, dev, prod
                    'http://localhost:3000', //stage, dev, prod
                    'chrome-extension://aiipihanfbemhegopmlekpccbeojgfgk',
                    'https://gcn.samudai.xyz',
                    'https://points.samudai.xyz',
                    'http://points.samudai.xyz',
                ];
                break;
            default:
                origin = [
                    'http://dev.samudai.xyz', //dev
                    'https://dev.samudai.xyz', //dev
                    'http://localhost:3001', //stage, dev, prod
                    'http://localhost:3000', //stage, dev, prod
                    'http://stage.samudai.xyz', //stage
                    'https://stage.samudai.xyz', //stage
                    'http://app.samudai.xyz', //prod
                    'https://app.samudai.xyz', //prod
                    'https://samudai.xyz', //prod, dev, stage
                    'http://samudai.xyz', //prod, dev, stage
                    'https://dev-parcel.samudai.xyz', //stage, dev, prod
                    'https://samudai-app-view.web.app', //stage, dev
                    'chrome-extension://aiipihanfbemhegopmlekpccbeojgfgk',
                    'chrome-extension://hhgjpkmpogpkbkbhhmdhpcfcljdeegab',
                    'https://dev-gcn.samudai.xyz',
                    'https://dev.points.samudai.xyz',
                    'http://dev.points.samudai.xyz',
                ];
                break;
        }
        this.app.use(
            cors({
                origin: origin,
                methods: ['GET', 'POST', 'DELETE'],
                credentials: true,
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'Accept',
                    'Origin',
                    'X-Requested-With',
                    'X-CSRF-Token',
                    'daoid',
                    'memberid',
                    'projectid',
                    'daoId',
                    'memberId',
                    'projectId',
                    'taskid',
                    'taskId',
                    'Access-Token',
                ],
            })
        );
        this.app.use(morgan('short'));
        this.app.use(
            fileUpload({
                limits: { fileSize: 5 * 1024 * 1024 },
            })
        );
    };

    includeConfig = () => {
        this.setAppConfig();
    };
}
