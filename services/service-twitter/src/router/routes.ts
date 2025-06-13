import express, { Express, Router } from 'express';
import { TweetController } from '../controller/tweetController';
import { VerifyController } from '../controller/verifyController';

export class Routes {
  app: Express;

  verifyRouter: Router;
  tweetRouter: Router;

  verifyController: VerifyController;
  tweetController: TweetController;

  constructor(app: Express) {
    this.app = app;
    this.verifyRouter = express.Router();
    this.tweetRouter = express.Router();

    this.verifyController = new VerifyController();
    this.tweetController = new TweetController();
  }

  verifyRouters = () => {
    this.verifyRouter.post('/verify', this.verifyController.verify);
    this.verifyRouter.get('/verified/:id', this.verifyController.getVerified);
    this.verifyRouter.get('/byusername/:username', this.verifyController.getByUsername);
    this.app.use('/twitter', this.verifyRouter);
  };

  tweetRouters = () => {
    //this.tweetRouter.post('/add/featured', this.tweetController.addFeaturedTweet);
    this.tweetRouter.get('/get/featured/:linkId', this.tweetController.getFeaturedTweet);
    //this.tweetRouter.post('/update/featured', this.tweetController.updateFeaturedTweet);

    this.tweetRouter.delete('/delete/:linkId', this.tweetController.deleteTweet);
    this.app.use('/twitter', this.tweetRouter);
  };

  routesConfig = () => {
    this.verifyRouters();
    this.tweetRouters();

    this.app.get('/health', (req, res) => {
      res.send('service-twitter is running!');
    });

    this.app.get('*', (req, res) => {
      res.send({ message: 'Page not found' });
    });
  };
}
