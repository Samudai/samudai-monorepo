import express, { Express, Router } from 'express';
import { MemberConnectionController } from '../../controllers/memberController/connections';
import { MemberDiscoveryController } from '../../controllers/memberController/discovery';
import { LoginController } from '../../controllers/memberController/login';
import { MemberController } from '../../controllers/memberController/member';
import { MemberReviewController } from '../../controllers/memberController/reviews';
import { MemberRewardController } from '../../controllers/memberController/rewards';
import { SignupController } from '../../controllers/memberController/signup';
import { MemberSocialsController } from '../../controllers/memberController/socials';
import { SubdomainController } from '../../controllers/memberController/subdomain';
import { TelegramController } from '../../controllers/memberController/telegram';
import { WaitlistController } from '../../controllers/memberController/waitlist';
import { MemberWalletController } from '../../controllers/memberController/wallet';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';
import { MobileController } from '../../controllers/memberController/mobile';
import { CoposterController } from '../../controllers/memberController/coposter';
// import { requireAuth } from '../../middlewares/requireA } from '../../middlewares/verifyAuth';

export class MemberRouter {
    app: Express;
    private router: Router;
    private loginController: LoginController;
    private signupController: SignupController;
    private memberController: MemberController;
    private waitlistController: WaitlistController;
    private memberWalletController: MemberWalletController;
    private memberDiscoveryController: MemberDiscoveryController;
    private memberConnectionController: MemberConnectionController;
    private memberSocialsController: MemberSocialsController;
    private memberReviewController: MemberReviewController;
    private memberRewardController: MemberRewardController;
    private telegramController: TelegramController;
    private mobileController: MobileController;
    private coposterController: CoposterController;
    private subdomainController: SubdomainController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();

        this.loginController = new LoginController();
        this.signupController = new SignupController();
        this.memberController = new MemberController();
        this.waitlistController = new WaitlistController();
        this.memberWalletController = new MemberWalletController();
        this.memberDiscoveryController = new MemberDiscoveryController();
        this.memberConnectionController = new MemberConnectionController();
        this.memberSocialsController = new MemberSocialsController();
        this.memberReviewController = new MemberReviewController();
        this.memberRewardController = new MemberRewardController();
        this.telegramController = new TelegramController();
        this.mobileController = new MobileController();
        this.coposterController = new CoposterController();
        this.subdomainController = new SubdomainController();
    }

    memberRouter = () => {
        // Generate Auth Token using RefreshToken
        this.router.post('/reauth/refresh-token', this.loginController.reauth);

        //Login - 1
        this.router.post('/login', this.loginController.login);
        this.router.post('/demo/login', this.loginController.demoLogin);
        //this.router.get('/login/nonce', this.loginController.getNonce);

        //Signup - 1
        this.router.post('/linkdiscord', this.signupController.linkDiscord);
        this.router.get('/listadminguilds/:memberId', this.signupController.listAdminGuilds);

        //Onboarding - 1
        this.router.post('/completeOnboarding', this.signupController.completeMemberOnboarding);

        //Member -
        this.router.post('/fetch', requireVerifyAuth, this.memberController.fetchMember);
        this.router.get('/get/workprogress/:memberId', requireVerifyAuth, this.memberController.getMemberWorkProgress);
        this.router.post('/getmembers', requireVerifyAuth, this.memberController.getMembersBulk);
        this.router.post('/update', requireVerifyAuth, this.memberController.updateMember);
        this.router.post('/rate/update', requireVerifyAuth, this.memberController.updateMemberHourlyRate);
        this.router.post(
            '/update/opportunitystatus',
            requireVerifyAuth,
            this.memberController.UpdateMemberOpportunityStatus
        );
        this.router.post('/update/domaintags', requireVerifyAuth, this.memberController.updateDomainTagsWorkForMember);
        this.router.post(
            '/update/featuredprojects',
            requireVerifyAuth,
            this.memberController.updateFeaturedProjectsForMember
        );
        this.router.delete('/delete/:memberId', requireVerifyAuth, this.memberController.deleteMember);
        this.router.get('/checkusername/:username', this.memberController.checkUserName);
        this.router.post('/update/name&pfp', requireVerifyAuth, this.memberController.updateNameAndPfpForMember);
        this.router.post('/update/ceramic', requireVerifyAuth, this.memberController.updateCeramicStream);
        this.router.post('/update/subdomain', requireVerifyAuth, this.memberController.updateSubdomainForMember);
        this.router.post('/update/claimnft', requireVerifyAuth, this.memberController.updateClaimNFT);
        this.router.post('/update/email', requireVerifyAuth, this.memberController.updateEmailForMember);
        this.router.get('/is/emailupdated/:member_id', requireVerifyAuth, this.memberController.isEmailUpdated);
        this.router.get('/get/invitecount/:memberId', requireVerifyAuth, this.memberController.getInviteCountForMember);
        this.router.get('/get/all/contributors', requireVerifyAuth, this.memberController.getAllContributor);
        this.router.get(
            '/get/all/contributors/open_to_work',
            requireVerifyAuth,
            this.memberController.getAllOpenToWorkContributor
        );
        this.router.post('/getbulkmember/discovery', this.memberController.getBulkMembersForDiscovery);
        this.router.post('/getbulktelegramchatids', this.memberController.getBulkTelelegramChatIds);
        this.router.post('/adddao', this.memberController.addDaoForMember);

        // Subdomain
        this.router.post('/update/subdomainrequest', requireVerifyAuth, this.subdomainController.requestSubdomain);
        this.router.get('/checksubdomain/:subdomain', this.subdomainController.checkSubdomainForMember);
        this.router.get('/fetchsubdomainbymemberid/:memberId', this.subdomainController.fetchSubdomainByMemberId);
        this.router.get('/getCID/:memberId/:subdomain', this.subdomainController.getCID);
        this.router.post('/subdomain/create', this.subdomainController.createSubdomain);
        this.router.get('/subdomain/get/:member_id/:subdomain', this.subdomainController.getSubdomainForMember);
        this.router.get(
            '/subdomain/checksubdomaincreate/:member_id',
            this.subdomainController.checkSubdomainCreateForMember
        );

        // Domain_tags_for_work
        this.router.get('/domaintags/getall', requireVerifyAuth, this.memberController.listDomainsForWorkTags);

        //Tags
        this.router.post('/update/tags', requireVerifyAuth, this.memberController.updateTagsForMember);
        this.router.get('/tag/getall', requireVerifyAuth, this.memberController.listTags);

        //skill
        //this.router.post('/skill/create', this.memberController.createMemberSkill);
        this.router.get('/skill/getall', requireVerifyAuth, this.memberController.listSkills);
        this.router.post('/update/skills', requireVerifyAuth, this.memberController.updateSkillsForMember);

        //Profile photo
        this.router.post('/uploadProfilePicture', this.memberController.createProfilePicture);
        this.router.post('/update/pfp', requireVerifyAuth, this.memberController.updateProfilePicture);

        this.router.post('/onboarding', this.memberController.updateOnBoarding);
        this.router.post('/update/userorignialname', this.memberController.updateMemberOriginalName);
        this.router.post('/uploadfiles', this.memberController.uploadFiles);
        //Adding the router to the app

        //socials
        this.router.post('/social/create', this.memberSocialsController.createMemberSocial);
        this.router.get('/social/get/:memberId', requireVerifyAuth, this.memberSocialsController.getMemberSocial);
        this.router.post('/social/update', requireVerifyAuth, this.memberSocialsController.updateMemberSocial);
        this.router.delete(
            '/social/delete/:socialId',
            requireVerifyAuth,
            this.memberSocialsController.deleteMemberSocial
        );

        //wallet
        this.router.post('/wallet/create', requireVerifyAuth, this.memberWalletController.createWallet);
        this.router.get(
            '/wallet/default/:memberId',

            requireVerifyAuth,
            this.memberWalletController.getDefaultWallet
        );
        this.router.post('/wallet/update', requireVerifyAuth, this.memberWalletController.updateWallet);
        this.router.delete(
            '/wallet/delete/:memberId/:walletAddress',

            requireVerifyAuth,
            this.memberWalletController.deleteWalletForMember
        );

        //connection
        this.router.post(
            '/connection/create',

            requireVerifyAuth,
            this.memberConnectionController.createConnection
        );
        this.router.get(
            '/connection/receiver/:memberId',

            requireVerifyAuth,
            this.memberConnectionController.listbyReceiver
        );
        this.router.get(
            '/connection/sender/:memberId',

            requireVerifyAuth,
            this.memberConnectionController.listbySender
        );
        this.router.get(
            '/connection/list/:memberId',

            requireVerifyAuth,
            this.memberConnectionController.getConnectionsByMemberId
        );
        this.router.get(
            '/connection/listall/:memberId',

            requireVerifyAuth,
            this.memberConnectionController.getAllConnectionsByMemberId
        );
        this.router.post(
            '/connection/update',

            requireVerifyAuth,
            this.memberConnectionController.updateConnection
        );
        this.router.delete(
            '/connection/delete/:senderId/:receiverId',

            requireVerifyAuth,
            this.memberConnectionController.deleteConnection
        );
        this.router.get(
            '/connection/status/:viewerId/:memberId',

            requireVerifyAuth,
            this.memberConnectionController.getConnectionStatus
        );

        //Review
        this.router.post('/review/create', requireVerifyAuth, this.memberReviewController.createReview);
        this.router.get('/review/get/:memberId', requireVerifyAuth, this.memberReviewController.listReview);
        this.router.get(
            '/review/get/byreviewer/:reviewerId',

            requireVerifyAuth,
            this.memberReviewController.listByReviewerId
        );
        this.router.delete(
            '/review/delete/:reviewId',

            requireVerifyAuth,
            this.memberReviewController.deleteReview
        );

        //Reward
        this.router.post('/reward/create', requireVerifyAuth, this.memberRewardController.createReward);
        this.router.get('/reward/get/:memberId', requireVerifyAuth, this.memberRewardController.getRewardsForMember);

        //Waitlist
        this.router.get('/waitlist/create/:email', this.waitlistController.createEntry);

        // Telegram
        this.router.get('/telegram/add', requireVerifyAuth, this.telegramController.addTelegramForMember);
        this.router.post('/telegram/generateOtp', requireVerifyAuth, this.telegramController.GenerateOtpForTelegram);
        this.router.get('/telegram/exists/:memberId', requireVerifyAuth, this.telegramController.CheckIfTelegramExists);
        this.router.get('/telegram/get/:memberId', requireVerifyAuth, this.telegramController.GetTelegramForMember);
        this.router.delete(
            '/telegram/delete/:memberId',
            requireVerifyAuth,
            this.telegramController.DeleteTelegramForMember
        );

        // Mobile App
        this.router.post('/mobile/add', this.mobileController.addMobileForMember);
        this.router.post('/mobile/generateOtp', requireVerifyAuth, this.mobileController.GenerateOtpForMobile);
        this.router.get('/mobile/get/linkstatus/:memberId', this.mobileController.GetLinkedStatusForMobile);
        this.router.delete('/mobile/delete/:memberId', requireVerifyAuth, this.mobileController.DeleteMobileForMember);
        this.router.post('/mobile/fetch/imember', requireVerifyAuth, this.mobileController.FetchIMemberForMobile);
        this.router.get(
            '/mobile/fetch/idaosformember/:memberId',
            requireVerifyAuth,
            this.mobileController.getIDAOForMobile
        );

        // Coposting Extension
        this.router.get('/coposter/forcaster/neynarouth/:memberId', this.coposterController.neynarOauth);
        this.router.post('/coposter/forcaster/createuser', this.coposterController.createUser);
        this.router.post('/coposter/forcaster/cast', this.coposterController.sendMultipleCast);
        this.router.post('/coposter/forcaster/replytocast', this.coposterController.replyToPrevCast);
        this.router.post('/coposter/twitter/tweet', this.coposterController.sendMultipleTweet);
        this.router.get(
            '/coposter/forcaster/getUserDetails/:coposterUserId',
            this.coposterController.getFarcasterUserDetails
        );
        this.router.post('/coposter/x/updateUser', this.coposterController.updateXUser);
        this.router.post('/coposter/warpcast/updateUser', this.coposterController.updateWarpcastUser);

        this.app.use('/api/member', this.router);
    };
}
