import { Express } from 'express';
import { NotFoundError } from '../errors/notFoundError';
import { errorHandler } from '../middlewares/errorHandler';
import { AccessRouter } from './accessManagement/accessRouter';
import { ActivityRouter } from './activity/activityRouter';
import { DAORouter } from './dao/daoRouter';
import { DashboardRouter } from './dashboard/dashboardRouter';
import { DiscordRouter } from './discord/discordRouter';
import { DiscoveryRouter } from './discovery/discoveryRouter';
import { DiscussionRouter } from './discussion/discussionRouter';
import { UploadRouter } from './fileUpload/fileuploadRouter';
import { FormRouter } from './form/formRouter';
import { JobsRouter } from './jobs/jobsRouter';
import { ClanRouter } from './member/clanRouter';
import { MemberRouter } from './member/memberRouter';
import { NotificationRouter } from './notification/notification';
import { ParcelRouter } from './parcel/parcelRouter';
import { PaymentRouter } from './payments/paymentRouter';
import { PluginRouter } from './plugin/pluginRouter';
import { ProjectManagementRouter } from './project/projectRouter';
import { SearchRouter } from './search/searchRouter';
import { TwitterRouter } from './twitter/twitterRouter';
import { Web3Router } from './web3/web3Router';
import { CronRouter } from './cron/cronRouter';
import { StripeRouter } from './stripe/stripeRouter';
import { PointsRouter } from './point/pointRouter';

export class Routes {
    app: Express;
    daoRouter: DAORouter;
    memberRouter: MemberRouter;
    accessRouter: AccessRouter;
    projectManagementRouter: ProjectManagementRouter;
    jobsRouter: JobsRouter;
    dashboardRouter: DashboardRouter;
    paymentRouter: PaymentRouter;
    twitterRouter: TwitterRouter;
    clanRouter: ClanRouter;
    uploadRouter: UploadRouter;
    pluginRouter: PluginRouter;
    parcelRouter: ParcelRouter;
    discussionRouter: DiscussionRouter;
    web3Router: Web3Router;
    activityRouter: ActivityRouter;
    formRouter: FormRouter;
    discordRouter: DiscordRouter;
    searchRouter: SearchRouter;
    notificationRouter: NotificationRouter;
    discoveryRouter: DiscoveryRouter;
    stripeRouter: StripeRouter;
    pointsRouter: PointsRouter;
    cronRouter: CronRouter;

    constructor(app: Express) {
        this.app = app;
        this.daoRouter = new DAORouter(this.app);
        this.memberRouter = new MemberRouter(this.app);
        this.accessRouter = new AccessRouter(this.app);
        this.projectManagementRouter = new ProjectManagementRouter(this.app);
        this.jobsRouter = new JobsRouter(this.app);
        this.dashboardRouter = new DashboardRouter(this.app);
        this.paymentRouter = new PaymentRouter(this.app);
        this.twitterRouter = new TwitterRouter(this.app);
        this.clanRouter = new ClanRouter(this.app);
        this.uploadRouter = new UploadRouter(this.app);
        this.pluginRouter = new PluginRouter(this.app);
        this.parcelRouter = new ParcelRouter(this.app);
        this.discussionRouter = new DiscussionRouter(this.app);
        this.web3Router = new Web3Router(this.app);
        this.activityRouter = new ActivityRouter(this.app);
        this.formRouter = new FormRouter(this.app);
        this.discordRouter = new DiscordRouter(this.app);
        this.searchRouter = new SearchRouter(this.app);
        this.notificationRouter = new NotificationRouter(this.app);
        this.discoveryRouter = new DiscoveryRouter(this.app);
        this.stripeRouter = new StripeRouter(this.app);
        this.pointsRouter = new PointsRouter(this.app);
        this.cronRouter = new CronRouter();
    }

    routesConfig = () => {
        this.daoRouter.daoRouter();
        this.memberRouter.memberRouter();
        this.accessRouter.accessrouter();
        this.projectManagementRouter.projectManagementRouter();
        this.jobsRouter.jobsRouter();
        this.dashboardRouter.dashboardrouter();
        this.paymentRouter.paymentRouter();
        this.twitterRouter.twitterRouter();
        this.clanRouter.clanRouter();
        this.uploadRouter.uploadRouter();
        this.pluginRouter.pluginRouter();
        this.parcelRouter.parcelRouter();
        this.discussionRouter.discussionRouter();
        this.web3Router.web3Router();
        this.activityRouter.activityRouter();
        this.formRouter.formRouter();
        this.discordRouter.discordRouter();
        this.searchRouter.searchRouter();
        this.notificationRouter.notificationRouter();
        this.discoveryRouter.discoveryRouter();
        this.cronRouter.cronRouter();
        this.stripeRouter.stripeRouter();
        this.pointsRouter.pointsRouter();

        this.app.get('/health', (req, res) => {
            res.send('Gateway Consumer is running!');
        });

        this.app.get('*', (req, res) => {
            throw new NotFoundError();
        });

        this.app.use(errorHandler);
    };
}
