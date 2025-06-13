import { json } from 'body-parser';
import cors from 'cors';
import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

export class AppConfig {
    app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    setAppConfig = () => {
        this.app.use(json());
        this.app.set('trust proxy', false);
        this.app.use(
            cors({
                origin: [
                    'http://dev.samudai.xyz',
                    'https://dev.samudai.xyz',
                    'http://localhost:3001',
                    'http://localhost:3000',
                    'http://stage.samudai.xyz',
                    'https://stage.samudai.xyz',
                    'http://app.samudai.xyz',
                    'https://app.samudai.xyz',
                ],
                methods: ['GET', 'POST', 'DELETE'],
                credentials: true,
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'Accept',
                    'Origin',
                    'X-Requested-With',
                    'X-CSRF-Token',
                ],
            })
        );
        this.app.use(morgan('short'));
        const limiter = rateLimit({
            max: 150,
            windowMs: 60 * 60 * 1000,
            message: 'Too Many Request from this IP, please try again in an hour'
        });
        this.app.use('/', limiter);
        this.app.use(helmet());
    };

    includeConfig = () => {
        this.setAppConfig();
    };
}
