import { Express, Router } from 'express';
import { NotFoundError } from '../errors/notFoundError';
import { healthCheck } from '../controllers/telegrambot';
import { publishNotification, disconnectTelegram } from '../controllers/telegrambot';

export class Routes {
  app: Express;
  telegramRouter: Router;



  constructor(app: Express) {
    this.app = app;

    this.telegramRouter = Router();

  }

  telegramRoutes = () => {

    this.telegramRouter.post('/publish/notifications', publishNotification);
    this.telegramRouter.delete('/disconnect/:chat_id', disconnectTelegram);

    this.app.use('/api/telegram', this.telegramRouter)
  }

  routesConfig = () => {

    this.telegramRoutes();

    this.app.get('/health', healthCheck);

    this.app.get('*', (req, res) => {
      throw new NotFoundError();
    });
  };
}
