import cron from 'node-cron';
import { MostActiveController } from '../../controllers/cronController/mostActive';
import { MostViewedController } from '../../controllers/cronController/mostViewed';
import { PendingProposalsController } from '../../controllers/cronController/pendingProposal';
import { PointCronController } from '../../controllers/cronController/pointsCronJob';
export class CronRouter {
    private mostActiveController: MostActiveController;
    private mostViewedController: MostViewedController;
    private pendingProposalsController: PendingProposalsController;
    private pointCronController: PointCronController;

    constructor() {
        this.mostActiveController = new MostActiveController();
        this.mostViewedController = new MostViewedController();
        this.pendingProposalsController = new PendingProposalsController();
        this.pointCronController = new PointCronController();
    }

    cronRouter = () => {
        cron.schedule('0 0 23 * * *', () => {
            this.mostActiveController.mostActiveDAOCron();
            this.mostActiveController.mostActiveContributorCron();
            this.mostViewedController.mostViewedDAOCron();
            this.mostViewedController.mostViewedContributorCron();
            this.pendingProposalsController.pendingProposalCron();
            this.pointCronController.guildMetricCron();
        });
        cron.schedule('0 30 23 * * *', () => {
            this.pointCronController.removeDuplicateCron();
        });
    };
}
