import express, { Express, Router } from 'express';
import { DAOProfileController } from '../../controllers/daoControllers/dao';
import { DAOMemberController } from '../../controllers/daoControllers/daoMember';
import { DAORoleController } from '../../controllers/daoControllers/daoRole';
// import { DAOPartnerController } from '../../controllers/daoControllers/daoPartner';
// import { DAOPartnerSocialController } from '../../controllers/daoControllers/daoPartnerSocial';
import { DAOBlogController } from '../../controllers/daoControllers/blogs';
import { DAOCollaborationController } from '../../controllers/daoControllers/collaboration';
import { DAOCollaborationPassController } from '../../controllers/daoControllers/collaborationPass';
import { DAOInviteController } from '../../controllers/daoControllers/daoInvite';
import { DAOSocialController } from '../../controllers/daoControllers/daoSocial';
import { DAODepartmentController } from '../../controllers/daoControllers/departments';
import { DAOFavouriteController } from '../../controllers/daoControllers/favourite';
import { MemberRoleController } from '../../controllers/daoControllers/memberRole';
import { DAOReviewController } from '../../controllers/daoControllers/review';
import { DAOTokenController } from '../../controllers/daoControllers/token';
import { DAOSubdomainController } from '../../controllers/daoControllers/subdomain';
//import { adminRoleAuth } from '../../middlewares/DAORoleAuth';
import { DAOAnalyticsController } from '../../controllers/daoControllers/daoAnalytics';
import { manageDAOAccess, viewAccess } from '../../middlewares/DAORoleAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class DAORouter {
    app: Express;
    private router: Router;
    private daoProfileController: DAOProfileController;
    private daoMemberController: DAOMemberController;
    //private daoPartnerController: DAOPartnerController;
    //private DAOPartnerSocialController: DAOPartnerSocialController;
    private daoRoleController: DAORoleController;
    private daoSocialController: DAOSocialController;
    private daoFavouriteController: DAOFavouriteController;
    private daoTokenController: DAOTokenController;
    private daoMemberRoleController: MemberRoleController;
    private daoInviteController: DAOInviteController;
    private daoCollaborationController: DAOCollaborationController;
    private daoCollaborationPassController: DAOCollaborationPassController;
    private daoDepartmentController: DAODepartmentController;
    private daoBlogController: DAOBlogController;
    private daoReviewController: DAOReviewController;
    private analyticsController: DAOAnalyticsController;
    private subdomainController: DAOSubdomainController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.daoProfileController = new DAOProfileController();
        this.daoMemberController = new DAOMemberController();
        //this.daoPartnerController = new DAOPartnerController();
        this.daoRoleController = new DAORoleController();
        this.daoSocialController = new DAOSocialController();
        //this.DAOPartnerSocialController = new DAOPartnerSocialController();
        this.daoFavouriteController = new DAOFavouriteController();
        this.daoTokenController = new DAOTokenController();
        this.daoMemberRoleController = new MemberRoleController();
        this.daoInviteController = new DAOInviteController();
        this.daoCollaborationController = new DAOCollaborationController();
        this.daoCollaborationPassController = new DAOCollaborationPassController();
        this.daoDepartmentController = new DAODepartmentController();
        this.daoBlogController = new DAOBlogController();
        this.daoReviewController = new DAOReviewController();
        this.analyticsController = new DAOAnalyticsController();
        this.subdomainController = new DAOSubdomainController();
    }

    daoRouter = () => {
        //DAOProfile
        this.router.post('/create', requireVerifyAuth, this.daoProfileController.createDAOProfile);
        this.router.get('/get/:daoId', requireVerifyAuth, this.daoProfileController.getDAOProfile);
        this.router.get('/getbyguildid/:guildId', this.daoProfileController.getDAObyGuildId);
        this.router.get('/getformember/:memberId', requireVerifyAuth, this.daoProfileController.getDAOForMember);
        this.router.post('/update', manageDAOAccess, this.daoProfileController.updateDAOProfile);
        this.router.delete('/delete/:daoId', manageDAOAccess, this.daoProfileController.deleteDAO);
        this.router.get('/members/:daoId/:access', requireVerifyAuth, this.daoProfileController.getMembersByAccess);
        this.router.get('/getlastestdao/:memberId', this.daoProfileController.getLatestDAOForMember);
        this.router.post('/update/onboarding', this.daoProfileController.updateOnBoardingForDAO);
        this.router.post('/update/profile_picture', this.daoProfileController.updatePFPForDAO);
        this.router.post('/claimsubdomain', this.daoProfileController.claimSubdomainForDAO);
        this.router.get('/checksubdomain/:subdomain', this.daoProfileController.checkSubdomainForDAO);
        this.router.post('/getbulkdao/discovery', this.daoProfileController.getBulkDaoForDiscovery);
        this.router.post('/linkdiscordbot/:dao_id/:guild_id', this.daoProfileController.linkdiscordbotForDAO);

        this.router.get('/fetchsubdomainbydaoid/:daoId', this.daoProfileController.fetchSubdomainByDAOId);
        this.router.get('/getsubscriptionfordao/:daoId', this.daoProfileController.getSubscriptionForDAO)
        this.router.post('/subdomain/create', this.subdomainController.createSubdomain);
        this.router.get('/subdomain/get/:dao_id/:subdomain', this.subdomainController.getSubdomainForDao);
        this.router.get(
            '/subdomain/checksubdomaincreate/:dao_id',
            this.subdomainController.checkSubdomainCreateForDao
        );


        // Tags
        this.router.get('/tag/getall', requireVerifyAuth, this.daoProfileController.listTags);
        this.router.post('/update/tags', this.daoProfileController.updateTagsForDAO);

        //DAO member
        this.router.post('/member/create', requireVerifyAuth, this.daoMemberController.createDAOMember);
        this.router.get('/member/list/:daoId', requireVerifyAuth, this.daoMemberController.getDAOMember);
        this.router.get('/member/getfordao/:daoId', requireVerifyAuth, this.daoMemberController.getMembersForDAO); 
        this.router.delete(
            '/member/delete/:daoId/:memberId',
            requireVerifyAuth,
            this.daoMemberController.deleteDAOMember
        );
        this.router.post('/member/createbulk', requireVerifyAuth, this.daoMemberController.createBulkDAOMember);
        this.router.get('/member/getalluuid/:daoId', this.daoMemberController.listmemberforDAOUUID);
        this.router.post('/member/update/license', requireVerifyAuth, this.daoMemberController.updateDAOMemberLicense)
        this.router.post('/member/update/licensebulk', requireVerifyAuth, this.daoMemberController.updateDAOMemberLicenseBulk)
        //snapshot
        this.router.post('/add/snapshot', manageDAOAccess, this.daoProfileController.addSnapshot);
        this.router.get('/member/team/:daoId/:memberId', this.daoMemberController.getTeamMemberInfo);

        this.router.post('/add/onboarding/snapshot', this.daoProfileController.addSnapshot);

        //DAO partner
        // this.router.post('/partner/create', requireAuth, verifyAuth, this.daoPartnerController.createPartner);
        // this.router.get('/partner/get/:daoId', requireAuth, verifyAuth, this.daoPartnerController.getPartner);
        // this.router.delete(
        //   '/partner/delete/:daoId/:partnerId',
        //   adminRoleAuth,
        //   requireAuth,
        //   verifyAuth,
        //   this.daoPartnerController.deletePartner
        // );

        //DAO role
        this.router.post('/role/create', manageDAOAccess, this.daoRoleController.createDAORole);
        this.router.get('/role/get/:daoId', viewAccess, requireVerifyAuth, this.daoRoleController.getDAORole);
        this.router.delete('/role/delete/:daoId/:roleId', manageDAOAccess, this.daoRoleController.deleteRole);
        this.router.post('/role/createbulk', requireVerifyAuth, this.daoRoleController.createBulkRole);
        this.router.post('/role/update', manageDAOAccess, this.daoRoleController.updateDAORole);
        this.router.post('/role/updatediscord', requireVerifyAuth, this.daoRoleController.updateDiscordRole);
        this.router.get('/role/get/member/:daoId/:memberId', viewAccess, this.daoRoleController.getMemberRole);

        //Member Role

        this.router.post('/memberrole/create', manageDAOAccess, this.daoMemberRoleController.create);
        this.router.delete('/memberrole/delete/:memberRoleId', manageDAOAccess, this.daoMemberRoleController.delete);

        //DAO social
        this.router.post('/social/create', requireVerifyAuth, this.daoSocialController.createSocial);
        this.router.get('/social/get/:daoId', requireVerifyAuth, this.daoSocialController.getSocial);
        this.router.post('/social/update', manageDAOAccess, this.daoSocialController.updateSocial);
        this.router.delete('/social/delete/:daoId/:socialId', manageDAOAccess, this.daoSocialController.deleteSocial);

        //DAO partner social
        // this.router.post('/partnersocial/create', this.DAOPartnerSocialController.createPartnerSocial);
        // this.router.get('/partnersocial/get/:daoId', this.DAOPartnerSocialController.getPartnerSocial);
        // this.router.delete(
        //   '/partnersocial/delete/:daoId/:partnerSocialId',
        //   this.DAOPartnerSocialController.deletePartnerSocial
        // );
        // this.router.post('/partnersocial/update', this.DAOPartnerSocialController.updatePartnerSocial);

        //Favourties
        this.router.post('/favourites/create', requireVerifyAuth, this.daoFavouriteController.createFavourite);
        this.router.get('/favourites/get/:memberId', requireVerifyAuth, this.daoFavouriteController.getFavourite);
        this.router.get(
            '/favourites/countfordao/:daoId',
            requireVerifyAuth,
            this.daoFavouriteController.countFavouriteForDAO
        );
        this.router.delete(
            '/favourites/delete/:favouriteId',
            requireVerifyAuth,
            this.daoFavouriteController.deleteFavourite
        );

        //Token
        this.router.post('/token/create', requireVerifyAuth, this.daoTokenController.create);
        this.router.get('/token/get/:daoId', requireVerifyAuth, this.daoTokenController.getToken);
        this.router.delete('/token/delete/:tokenId', requireVerifyAuth, this.daoTokenController.delete);
        this.router.post('/token/update', requireVerifyAuth, this.daoTokenController.update);

        //DAO Invite
        this.router.post('/invite/create', requireVerifyAuth, this.daoInviteController.create);
        this.router.post('/invite/add/member', requireVerifyAuth, this.daoInviteController.addMemberByInvite);
        this.router.delete('/invite/delete/:inviteId', requireVerifyAuth, this.daoInviteController.deleteInvite);

        //DAO Collaboration
        this.router.post('/collaboration/create', manageDAOAccess, this.daoCollaborationController.create);
        this.router.post('/collaboration/update/status', requireVerifyAuth, this.daoCollaborationController.updateCollaborationStatus);
        this.router.get('/collaboration/get/:daoId', requireVerifyAuth, this.daoCollaborationController.listForDAO);
        this.router.delete(
            '/collaboration/delete/:collaborationId',
            manageDAOAccess,
            this.daoCollaborationController.deleteCollaboration
        );

        // DAO Collaboration Pass
        this.router.post('/collaborationpass/create', this.daoCollaborationPassController.create)
        this.router.get('/collaborationpass/get/:daoId', requireVerifyAuth, this.daoCollaborationPassController.getForDAO);
        this.router.post('/collaborationpass/update', this.daoCollaborationPassController.update)
        this.router.delete(
            '/collaborationpass/delete/:collaborationPassId',
            this.daoCollaborationPassController.deleteCollaborationPass
        );

        //Department
        this.router.post('/department/onboarding/createbulk', this.daoDepartmentController.createDepartmentOnboarding);
        this.router.post('/department/create', manageDAOAccess, this.daoDepartmentController.createDepartment);
        this.router.get('/department/get/:daoId', viewAccess, this.daoDepartmentController.listDepartmentForDAO);
        this.router.delete(
            '/department/delete/:departmentId',
            manageDAOAccess,
            this.daoDepartmentController.deleteDepartment
        );

        // Blogs
        this.router.post('/blog/create', manageDAOAccess, this.daoBlogController.createBlog);
        this.router.get('/blog/get/:daoId', requireVerifyAuth, this.daoBlogController.listBlogForDAO);
        this.router.delete('/blog/delete/:blogId', manageDAOAccess, this.daoBlogController.deleteBlog);

        // Reviews
        this.router.post('/review/create', requireVerifyAuth, this.daoReviewController.createReview);
        this.router.get('/review/get/:daoId', requireVerifyAuth, this.daoReviewController.listReviewForDAO);
        this.router.delete('/review/delete/:reviewId', requireVerifyAuth, this.daoReviewController.deleteReview);

        //alaytics
        this.router.get('/analytics/dao/:daoId', this.analyticsController.getAnalyticsForDAO);
        this.router.post('/analytics/dao/add', this.analyticsController.addAnalytics);
        this.router.get('/analytics/applicantcount/:daoId', this.analyticsController.getApplicantCountforday);
        this.router.get('/analytics/get/activetask/:daoId', this.analyticsController.getActiveTaskCountforday);
        this.router.get('/analytics/get/activeforum/:daoId', this.analyticsController.getActiveForumCountforday);
        this.router.get('/analytics/get/pendingproposal/:daoId', this.analyticsController.getActiveProposalCountforday);
        //Adding the router to the app
        this.app.use('/api/dao', this.router);
    };
}
