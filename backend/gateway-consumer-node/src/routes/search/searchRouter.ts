import express, { Express } from 'express';
import { SearchController } from '../../controllers/searchController/search';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class SearchRouter {
    app: Express;
    public router: express.Router;
    public searchController: SearchController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();

        this.searchController = new SearchController();
    }

    searchRouter = () => {
        this.router.get('/member/:query', requireVerifyAuth, this.searchController.memberSearch);
        this.router.get('/dao/:query', requireVerifyAuth, this.searchController.daoSearch);
        this.router.get('/daomember/:daoId', requireVerifyAuth, this.searchController.daoMemberSearch);
        this.router.get('/project/:query', requireVerifyAuth, this.searchController.projectSearch);
        this.router.get('/universal/:query', requireVerifyAuth, this.searchController.universalSearch);
        this.app.use('/api/search', this.router);
    };
}
