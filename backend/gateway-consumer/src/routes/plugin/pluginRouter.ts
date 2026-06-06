import express, { Express, Router } from 'express';
import { GcalController } from '../../controllers/pluginController/gcal';
import { GithubController } from '../../controllers/pluginController/github';
import { NotionController } from '../../controllers/pluginController/notion';
import { PluginController } from '../../controllers/pluginController/plugincontroller';
import { viewAccess } from '../../middlewares/DAORoleAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class PluginRouter {
    app: Express;
    private router: Router;
    private notionController: NotionController;
    private githubController: GithubController;
    private gcalController: GcalController;
    private pluginController: PluginController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.notionController = new NotionController();
        this.githubController = new GithubController();
        this.gcalController = new GcalController();
        this.pluginController = new PluginController();
    }

    pluginRouter = () => {
        // Plugin
        this.router.post('/notion/auth', this.notionController.auth);
        this.router.post('/notion/getalldatabase', requireVerifyAuth, this.notionController.getAllDatabase);
        this.router.post(
            '/notion/getdatabaseproperties',
            requireVerifyAuth,
            this.notionController.getDatabaseProperties
        );
        this.router.post('/notion/importdatabase', requireVerifyAuth, this.notionController.importDatabase);
        this.router.get('/notion/exists/:memberId', requireVerifyAuth, this.notionController.isExists);
        this.router.delete('/notion/delete/:memberId', requireVerifyAuth, this.notionController.deleteNotion);

        this.router.post('/github/auth', this.githubController.auth);
        this.router.get('/github/exists/:memberId', requireVerifyAuth, this.githubController.memberExists);
        this.router.delete('/github/delete/:memberId', requireVerifyAuth, this.githubController.deleteGithubForMember);

        this.router.post('/githubapp/auth', this.githubController.appauth);
        this.router.get('/githubapp/exists/:daoId', requireVerifyAuth, this.githubController.daoExists);
        this.router.get('/githubapp/getrepos/:daoId', requireVerifyAuth, this.githubController.getRepos);
        this.router.post('/githubapp/fetchissues', requireVerifyAuth, this.githubController.fetchIssues);
        this.router.post('/githubapp/fetchpullrequests', requireVerifyAuth, this.githubController.fetchPullRequests);
        this.router.delete('/githubapp/delete/:daoId', requireVerifyAuth, this.githubController.deleteGithubApp);

        //Gcal
        this.router.post('/gcal/auth', this.gcalController.auth);
        this.router.get('/gcal/get/access/:linkId', this.gcalController.getCalAccessForMember);
        this.router.delete('/gcal/delete/:linkId', requireVerifyAuth, this.gcalController.deleteGcalAccessForMember);

        this.router.get('/list/dao/:linkId', viewAccess, this.pluginController.getPluginListForDAO);
        this.router.get('/list/member/:memberId', requireVerifyAuth, this.pluginController.getPluginListForMember);

        this.app.use('/api/plugin', this.router);
    };
}
