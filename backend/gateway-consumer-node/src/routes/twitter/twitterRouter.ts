import express, { Express, Router } from 'express';
import { TwitterController } from '../../controllers/twitterController/twitter';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class TwitterRouter {
    app: Express;
    private router: Router;
    private twitterController: TwitterController;

    constructor(app: Express) {
        this.app = app;

        this.router = express.Router();
        this.twitterController = new TwitterController();
    }

    twitterRouter = () => {
        //Project
        this.router.post('/api/twitter/verify', requireVerifyAuth, this.twitterController.verifyTwitterUser);
        // this.router.post(
        //     '/api/twitter/add/featured',
        //     manageDaoAccess,
        //     requireAuth,
        //     verifyAuth,
        //     this.twitterController.addFeaturedTweet
        // );
        this.router.get('/api/twitter/get/featured/:linkId', this.twitterController.getFeaturedTweet);

        // this.router.post(s
        //     '/api/twitter/update/featured',
        //     manageDaoAccess,
        //     requireAuth,
        //     verifyAuth,
        //     this.twitterController.updateFeaturedTweet
        // );

        this.router.delete('/api/twitter/delete/:linkId', this.twitterController.deleteTweet)

        this.app.use(this.router);
    };
}
