import express, { Express, Router } from 'express';

import { ActivityController } from '../../controllers/activityController/activity';
import { OnboardingController } from '../../controllers/activityController/onboarding';
import { ProgressBarController } from '../../controllers/activityController/pgbar';

export class ActivityRouter {
    app: Express;
    private router: Router;

    private ActivityController: ActivityController;
    private onboardingController: OnboardingController;
    private ProgressBarController: ProgressBarController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.ActivityController = new ActivityController();
        this.onboardingController = new OnboardingController();
        this.ProgressBarController = new ProgressBarController();
    }

    activityRouter = () => {
        //DAOActivity

        this.router.post('/activity/add', this.ActivityController.createActivity);
        this.router.get('/activity/dao/:daoId', this.ActivityController.getActivityByDAO);
        this.router.get('/activity/action/:daoId/:action', this.ActivityController.getActivitybyActionForDAO);
        this.router.get('/activity/member/:daoId/:memberId', this.ActivityController.getActivitybyMemberForDAO);
        this.router.get('/activity/visibility/:daoId/:visibility', this.ActivityController.getActivityByVisibility);

        this.router.get('/activity/project/:projectId', this.ActivityController.getActivityByProject);
        this.router.get('/activity/task/:taskId', this.ActivityController.getActivityByTask);
        this.router.get('/activity/discussion/:discussionId', this.ActivityController.getDiscussionActivity);

        this.router.get('/activity/get/member/:memberId', this.ActivityController.getActivityForMember);

        // Survey Feedback
        this.router.post('/feedback/survey', this.ActivityController.addFeedbackForSamudai);
        this.router.post('/feedback/cancellation', this.ActivityController.addCancellationFeedbackForSamudai);

        //Onboarding
        this.router.post('/onboarding/add', this.onboardingController.addStep);

        // Progress Bar
        this.router.post('/progressbar/dao/update', this.ProgressBarController.updateProgressForDAO);
        this.router.get('/progressbar/get/dao/:daoId', this.ProgressBarController.getProgressForDAO);
        this.router.post('/progressbar/contributor/update', this.ProgressBarController.updateProgressForContributor);
        this.router.get('/progressbar/get/contributor/:memberId', this.ProgressBarController.getProgressForContributor);

        this.app.use('/api', this.router);
    };
}
