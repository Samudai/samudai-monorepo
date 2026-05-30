import express, { Express, Router } from 'express';
import { DiscoveryController } from '../../controllers/discoveryController/discovery';
import { MostActiveController } from '../../controllers/discoveryController/mostActive';
import { MostViewedController } from '../../controllers/discoveryController/mostViewed';

export class DiscoveryRouter {
    app: Express;
    public router: Router;
    public discoveryController: DiscoveryController;
    private mostActiveController: MostActiveController;
    private mostViewedController: MostViewedController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.discoveryController = new DiscoveryController();
        this.mostActiveController = new MostActiveController();
        this.mostViewedController = new MostViewedController();
    }

    discoveryRouter = () => {
        //discovery
        this.router.get('/dao/:memberId', this.discoveryController.discoverDAO);
        this.router.get('/member/:memberId', this.discoveryController.discoverMember);
        this.router.post('/dao/event/create', this.discoveryController.createDAOEvent);
        this.router.post('/member/event/create', this.discoveryController.createMemberEvent);
        this.router.get('/fetch/tags/:memberId', this.discoveryController.fetchTags);

        this.router.post('/views/add', this.discoveryController.addDiscoveryViews);

        // Most Active
        this.router.get('/mostactive/dao', this.mostActiveController.mostActiveDao)
        this.router.get('/mostactive/contributor', this.mostActiveController.mostActiveContributor)

        // Most Viewed
        this.router.get('/mostviewed/dao', this.mostViewedController.mostViewedDao)
        this.router.get('/mostviewed/contributor', this.mostViewedController.mostViewedContributor)

        this.app.use('/api/discovery', this.router);
    };
}
