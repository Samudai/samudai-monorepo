import express, { Router, Express } from 'express';
import { RedisController } from '../controllers/redisController';
import { CronController } from '../controllers/cronController';

export class Routes {
  app: Express;

  redisRouter: Router;

  redisController: RedisController;
  cronController: CronController;

  constructor(app: Express) {
    this.app = app;
    this.redisRouter = express.Router();
    this.redisController = new RedisController();
    this.cronController = new CronController();
  }

  redisRouters = () => {
    this.redisRouter.get('/get/:memberId', this.redisController.getNotificationsForUser);
    this.redisRouter.post('/readnotification/:memberId/:notificationId', this.redisController.readNotificationById);

    this.app.use('/notification', this.redisRouter);
  };

  cronRouter = () => {
    this.cronController.redisCleanup();
  };

  routesConfig = () => {
    this.redisRouters();
    this.cronRouter();

    this.app.get('/health', (req, res) => {
      res.status(200).send({
        message: 'Health check successfull',
      });
    });

    // Express 5 / path-to-regexp v8 requires a named wildcard ('*' alone throws).
    this.app.get('/*splat', (req, res) => {
      res.send({ message: 'Page not found' });
    });
  };
}
