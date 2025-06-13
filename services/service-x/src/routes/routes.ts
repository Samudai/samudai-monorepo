import express, { Express, Router } from 'express';
import { ActivityController } from '../controller/activityController';

export class Routes {
  app: Express;

  activityRouter: Router;

  activityController: ActivityController;

  constructor(app: Express) {
    this.app = app;

    this.activityRouter = express.Router();

    this.activityController = new ActivityController();
  }

  activityRouters = () => {
    //Activity Routes
    this.activityRouter.post('/fetch', this.activityController.fetchNewTwitterActivity);

    this.app.use('/activity', this.activityRouter);
  };

  routesConfig = () => {
    this.activityRouters();

    this.app.get('/health', (req, res) => {
      res.send('service-x is running!');
    });

    this.app.get('*', (req, res) => {
      res.send({ message: 'Page not found' });
    });
  };
}
