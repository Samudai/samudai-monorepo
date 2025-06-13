import express, { Express, Router } from 'express';
import { ActivityController } from '../controller/activityController';
import { OnboardingController } from '../controller/onboardingController';
import { ProgressBarController } from '../controller/progressBarController';
import { MostActiveController } from '../controller/mostActiveController';
import { EngagementController } from '../controller/engagementController';
import { ViewCountController } from '../controller/viewCountController';
import { ProposalCountController } from '../controller/proposalCountController';
import { FeedbackController } from '../controller/feedbackController';
import { AdminController } from '../controller/adminController';
export class Routes {
  app: Express;

  onboardingRouter: Router;
  activityRouter: Router;
  progressBarRouter : Router;
  mostActiveRouter : Router;
  engagementRouter : Router;
  viewCountRouter : Router;
  proposalCountRouter : Router;
  feedbackRouter : Router;
  adminRouter : Router;

  activityController: ActivityController;
  onboardingController: OnboardingController;
  progressBarController: ProgressBarController;
  mostActiveController: MostActiveController;
  engagementController: EngagementController;
  viewCountController : ViewCountController;
  proposalCountController: ProposalCountController;
  feedbackController : FeedbackController;
  adminController : AdminController

  constructor(app: Express) {
    this.app = app;

    this.onboardingRouter = express.Router();
    this.activityRouter = express.Router();
    this.progressBarRouter = express.Router();
    this.mostActiveRouter = express.Router();
    this.engagementRouter = express.Router();
    this.viewCountRouter = express.Router();
    this.proposalCountRouter = express.Router();
    this.feedbackRouter = express.Router();
    this.adminRouter = express.Router();


    this.onboardingController = new OnboardingController();
    this.activityController = new ActivityController();
    this.progressBarController = new ProgressBarController();
    this.mostActiveController = new MostActiveController();
    this.engagementController = new EngagementController();
    this.viewCountController = new ViewCountController();
    this.proposalCountController = new ProposalCountController();
    this.feedbackController = new FeedbackController();
    this.adminController = new AdminController();
  }

  activityRouters = () => {
    //Activity Routes
    this.activityRouter.post('/add', this.activityController.addActivity);
    this.activityRouter.get('/dao/:daoId', this.activityController.getActivityByDAO);
    this.activityRouter.get('/action/:daoId/:action', this.activityController.getActivitybyAction);
    this.activityRouter.get('/member/:daoId/:memberId', this.activityController.getActivitybyMemberForDAO);
    this.activityRouter.get('/visibility/:daoId/:visibility', this.activityController.getActivityByVisibilityForDAO);

    this.activityRouter.get('/project/:projectId', this.activityController.getActivitybyProject);
    this.activityRouter.get('/task/:taskId', this.activityController.getActivitybyTask);
    this.activityRouter.get('/discussion/:discussionId', this.activityController.getActivityByDiscussion);

    this.activityRouter.get('/get/member/:memberId', this.activityController.getActivityByMember);

    //Onboarding routes
    this.onboardingRouter.get('/get/:linkId', this.onboardingController.getOnboarding);
    this.onboardingRouter.post('/add', this.onboardingController.addStep);
    this.onboardingRouter.get('/get/step/:stepId/:linkId', this.onboardingController.getOnboardingByStep);
    this.onboardingRouter.delete('/delete/:linkId', this.onboardingController.deleteOnboarding);

    // Progress Bar
    this.progressBarRouter.post('/dao/update', this.progressBarController.updateDAOProgressBar)
    this.progressBarRouter.get('/dao/:daoId', this.progressBarController.getDAOProgressBar)
    this.progressBarRouter.post('/contributor/update', this.progressBarController.updateContributorProgressBar)
    this.progressBarRouter.get('/contributor/:memberId', this.progressBarController.getContributorProgressBar)


    // Most Active Routes
    this.mostActiveRouter.get('/dao', this.mostActiveController.mostActiveDao)
    this.mostActiveRouter.get('/contributor', this.mostActiveController.mostActiveContributor)

    // ViewCount Routes
    this.viewCountRouter.post('/discovery/add', this.viewCountController.addDiscoveryViews)
    this.viewCountRouter.get('/mostviewed/dao', this.viewCountController.getMostViewedDAO)
    this.viewCountRouter.get('/mostviewed/contributor', this.viewCountController.getMostViewedContributor)

    // Pending Proposal
    this.proposalCountRouter.post('/snapshot/proposal/add', this.proposalCountController.addSnapshotProposalCount)
    this.proposalCountRouter.get('/get/activeproposal/:daoId', this.proposalCountController.getActiveProposalsCountforDao)

    // Engagement Metrics
    // for most active
    this.engagementRouter.post('/mostactive/add', this.engagementController.addMostActive)
    this.engagementRouter.get('/mostactive/dao', this.engagementController.getMostActiveDAO)
    this.engagementRouter.get('/mostactive/contributor', this.engagementController.getMostActiveContributor)
    // for most viewed
    this.engagementRouter.post('/mostviewed/add', this.engagementController.addMostViewed)
    this.engagementRouter.get('/mostviewed/dao', this.engagementController.getMostViewedDAO)
    this.engagementRouter.get('/mostviewed/contributor', this.engagementController.getMostViewedContributor)

    // Feedback 
    this.feedbackRouter.post('/samudai/add', this.feedbackController.addFeedbackForSamudai)

    // Admin
    this.adminRouter.post('/dao/add', this.adminController.addAdminsForSamudaiDao)

    this.app.use('/activity', this.activityRouter);
    this.app.use('/onboarding', this.onboardingRouter);
    this.app.use('/progressbar', this.progressBarRouter)
    this.app.use('/mostactive', this.mostActiveRouter);
    this.app.use('/viewcount', this.viewCountRouter);
    this.app.use('/engagement', this.engagementRouter);
    this.app.use('/proposal', this.proposalCountRouter);
    this.app.use('/feedback', this.feedbackRouter);
    this.app.use('/admins', this.adminRouter);
  };

  routesConfig = () => {
    this.activityRouters();

    this.app.get('/health', (req, res) => {
      res.send('service-activity is running!');
    });

    this.app.get('*', (req, res) => {
      res.send({ message: 'Page not found' });
    });
  };
}
