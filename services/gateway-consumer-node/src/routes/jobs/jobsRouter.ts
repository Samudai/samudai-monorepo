import express, { Express, Router } from 'express';
import { ApplicantController } from '../../controllers/jobsController/applicant';
import { BountyController } from '../../controllers/jobsController/bounty';
import { JobsFavouriteController } from '../../controllers/jobsController/favourite';
import { JobFileController } from '../../controllers/jobsController/jobfile';
import { JobsController } from '../../controllers/jobsController/jobs';
import { SkillConroller } from '../../controllers/jobsController/skill';
import { SubmissionController } from '../../controllers/jobsController/submissions';
import { TagController } from '../../controllers/jobsController/tag';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';
import { FavouriteBountyController } from '../../controllers/jobsController/favouritebounty';
import { JobPayoutController } from '../../controllers/jobsController/payout';
import { AnalyticsController } from '../../controllers/jobsController/analytics';

export class JobsRouter {
    app: Express;

    private jobRouter: Router;
    private skillRouter: Router;
    private tagRouter: Router;
    private applicantRouter: Router;
    private bountyRouter: Router;
    private submissionRouter: Router;
    private favouriteRouter: Router;
    private favouriteBountyRouter: Router;
    private jobFileRouter: Router;
    private bountyFileRouter: Router;
    private payoutRouter: Router;
    private analyticsRouter: Router;

    private jobController: JobsController;
    private skillController: SkillConroller;
    private tagController: TagController;
    private applicantController: ApplicantController;
    private bountyController: BountyController;
    private submissionController: SubmissionController;
    private favouriteController: JobsFavouriteController;
    private favouriteBountyController: FavouriteBountyController;
    private jobFileController: JobFileController;
    private payoutController: JobPayoutController;
    private analyticsController: AnalyticsController;

    constructor(app: Express) {
        this.app = app;

        this.jobRouter = express.Router();
        this.skillRouter = express.Router();
        this.tagRouter = express.Router();
        this.applicantRouter = express.Router();
        this.bountyRouter = express.Router();
        this.submissionRouter = express.Router();
        this.favouriteRouter = express.Router();
        this.favouriteBountyRouter = express.Router();
        this.jobFileRouter = express.Router();
        this.bountyFileRouter = express.Router();
        this.payoutRouter = express.Router();
        this.analyticsRouter = express.Router();

        this.jobController = new JobsController();
        this.skillController = new SkillConroller();
        this.tagController = new TagController();
        this.applicantController = new ApplicantController();
        this.bountyController = new BountyController();
        this.submissionController = new SubmissionController();
        this.favouriteController = new JobsFavouriteController();
        this.favouriteBountyController = new FavouriteBountyController();
        this.jobFileController = new JobFileController();
        this.payoutController = new JobPayoutController();
        this.analyticsController = new AnalyticsController();
    }

    jobsRouter = () => {
        //Jobs
        this.jobRouter.post('/create', requireVerifyAuth, this.jobController.createJob);
        this.jobRouter.post('/update', requireVerifyAuth, this.jobController.updateJob);
        this.jobRouter.get('/get/:jobId', requireVerifyAuth, this.jobController.getJob);
        this.jobRouter.get('/list/:daoId', requireVerifyAuth, this.jobController.getJobsForDAO);
        this.jobRouter.post('/listbulkdao', requireVerifyAuth, this.jobController.getJobsForBulkDAO);
        this.jobRouter.get('/publiclist', requireVerifyAuth, this.jobController.getPublicJobs);
        this.jobRouter.get('/getjobsbymember/:memberId', requireVerifyAuth, this.jobController.getJobCreatedByMember);
        this.jobRouter.delete('/delete/:jobId', requireVerifyAuth, this.jobController.deleteJob);
        this.jobRouter.post('/update/status', requireVerifyAuth, this.jobController.updateJobStatus);
        this.jobRouter.post('/list/projects/member', requireVerifyAuth, this.jobController.listProjectJobsForMember);
        this.jobRouter.post('/list/tasks/member', requireVerifyAuth, this.jobController.listTaskJobsForMember);

        //Job file
        this.jobFileRouter.post('/create', requireVerifyAuth, this.jobFileController.createJobFile);
        this.jobFileRouter.get('/get/:jobId', requireVerifyAuth, this.jobFileController.getJobFiles);
        this.jobFileRouter.delete('/delete/:fileId', requireVerifyAuth, this.jobFileController.deleteFile);

        //Skill
        // this.skillRouter.post('/create',requireAuth, verifyAuth, this.skillController.createSkill);
        this.skillRouter.get('/list/job', requireVerifyAuth, this.skillController.getSkillListForJob);
        this.skillRouter.get('/list/bounty', requireVerifyAuth, this.skillController.getSkillListForBounty);
        //this.skillRouter.delete(
        //   '/delete/:skillId',
        //      //   requireAuth,
        //   verifyAuth,
        //   this.skillController.deleteSkill
        // );

        //Tag
        //this.tagRouter.post('/create',requireAuth, verifyAuth, this.tagController.createTag);
        this.tagRouter.get('/list/job', requireVerifyAuth, this.tagController.getTagListForJob);
        this.tagRouter.get('/list/bounty', requireVerifyAuth, this.tagController.getTagListForBounty);
        //this.tagRouter.delete('/delete/:tagId', this.tagController.deleteTag);

        //Applicant
        this.applicantRouter.post('/create', requireVerifyAuth, this.applicantController.createApplicant);
        this.applicantRouter.get('/get/:applicantId', requireVerifyAuth, this.applicantController.getApplicant);

        this.applicantRouter.get('/list/:jobId', requireVerifyAuth, this.applicantController.getApplicantsList);

        this.applicantRouter.get(
            '/list/member/:memberId',
            requireVerifyAuth,
            this.applicantController.getApplicantsListForMember
        );

        this.applicantRouter.delete(
            '/delete/:applicantId',
            requireVerifyAuth,
            this.applicantController.deleteApplicant
        );

        this.applicantRouter.get(
            '/list/clan/:clanId',
            requireVerifyAuth,
            this.applicantController.getApplicantsListForClan
        );

        this.applicantRouter.post('/update', requireVerifyAuth, this.applicantController.updateApplicant);
        this.applicantRouter.post('/update/status', requireVerifyAuth, this.applicantController.updateApplicantStatus);

        //Bounty
        this.bountyRouter.post('/create', requireVerifyAuth, this.bountyController.create);
        this.bountyRouter.get('/:bountyId', requireVerifyAuth, this.bountyController.getBountyById);
        this.bountyRouter.get('/list/:daoId', requireVerifyAuth, this.bountyController.listBountyForDao);
        this.bountyRouter.post('/listbulkdao', requireVerifyAuth, this.bountyController.listBountyForBulkDao);
        this.bountyRouter.get('/get/openlist', requireVerifyAuth, this.bountyController.listOpenBounty);
        this.bountyRouter.get(
            '/list/created/:memberId',
            requireVerifyAuth,
            this.bountyController.listCreatedBountyByMember
        );
        this.bountyRouter.post('/list/member', requireVerifyAuth, this.bountyController.listForMember);
        this.bountyRouter.post('/update', requireVerifyAuth, this.bountyController.updateBounty);
        this.bountyRouter.post('/update/status', requireVerifyAuth, this.bountyController.updateBountyStatus);
        this.bountyRouter.delete('/delete/:bountyId', requireVerifyAuth, this.bountyController.deleteBounty);

        //Bounty file Router
        this.bountyFileRouter.post('/create', requireVerifyAuth, this.bountyController.bountyFileCreate);
        this.bountyFileRouter.get('/list/:bountyId', requireVerifyAuth, this.bountyController.getBountyFile);
        this.bountyFileRouter.delete('/delete/:fileId', requireVerifyAuth, this.bountyController.deleteBountyFile);

        /**
         * Submissions
         */
        this.submissionRouter.post('/create', requireVerifyAuth, this.submissionController.create);
        this.submissionRouter.get('/get/:submissionId', requireVerifyAuth, this.submissionController.getSubmissionById);
        this.submissionRouter.get(
            '/list/bounty/:bountyId',
            requireVerifyAuth,
            this.submissionController.getSubmissionsByBounty
        );
        this.submissionRouter.get(
            '/list/member/:memberId',
            requireVerifyAuth,
            this.submissionController.getSubmissionsByMember
        );
        this.submissionRouter.get(
            '/list/clan/:clanId',
            requireVerifyAuth,
            this.submissionController.getSubmissionsByClan
        );
        this.submissionRouter.post('/review', requireVerifyAuth, this.submissionController.reviewSubmission);
        this.submissionRouter.delete(
            '/delete/:submissionId',
            requireVerifyAuth,
            this.submissionController.deleteSubmission
        );

        //Favourtie
        this.favouriteRouter.post('/create', requireVerifyAuth, this.favouriteController.create);
        this.favouriteRouter.get(
            '/get/member/:memberId',
            requireVerifyAuth,
            this.favouriteController.getFavouriteForMember
        );
        this.favouriteRouter.get('/get/count/:jobId', requireVerifyAuth, this.favouriteController.getCountForJob);
        this.favouriteRouter.delete(
            '/delete/:jobId/:memberId',
            requireVerifyAuth,
            this.favouriteController.deleteFavourite
        );

        //Favourtie
        this.favouriteBountyRouter.post('/create', requireVerifyAuth, this.favouriteBountyController.create);
        this.favouriteBountyRouter.get(
            '/get/member/:memberId',
            requireVerifyAuth,
            this.favouriteBountyController.getFavouriteForMember
        );
        this.favouriteBountyRouter.get(
            '/get/count/:bountyId',
            requireVerifyAuth,
            this.favouriteBountyController.getCountForBounty
        );
        this.favouriteBountyRouter.delete(
            '/delete/:bountyId/:memberId',
            requireVerifyAuth,
            this.favouriteBountyController.deleteFavourite
        );

        // Payout
        this.payoutRouter.post('/create', requireVerifyAuth, this.payoutController.createPayout);
        this.payoutRouter.post('/update', requireVerifyAuth, this.payoutController.updatePayout);
        this.payoutRouter.post('/update/status', requireVerifyAuth, this.payoutController.updatePayoutStatus);
        this.payoutRouter.post('/complete/:payoutId', requireVerifyAuth, this.payoutController.completePayout);
        this.payoutRouter.delete('/delete/:payoutId', requireVerifyAuth, this.payoutController.deletePayout);
        this.payoutRouter.get('/get/:payoutId', requireVerifyAuth, this.payoutController.getPayoutById);

        // Analytics 
        this.analyticsRouter.post('/jobstats', this.analyticsController.getJobAppliedCountForMember)

        this.app.use('/api/jobs', this.jobRouter);
        this.app.use('/api/jobsFile', this.jobFileRouter);
        this.app.use('/api/skill', this.skillRouter);
        this.app.use('/api/tag', this.tagRouter);
        this.app.use('/api/applicant', this.applicantRouter);
        this.app.use('/api/bounty', this.bountyRouter);
        this.app.use('/api/bountyFile', this.bountyFileRouter);
        this.app.use('/api/submission', this.submissionRouter);
        this.app.use('/api/favourite', this.favouriteRouter);
        this.app.use('/api/favourite/bounty', this.favouriteBountyRouter);
        this.app.use('/api/jobs/payout', this.payoutRouter);
        this.app.use('/api/jobs/analytics', this.analyticsRouter);
    };
}
