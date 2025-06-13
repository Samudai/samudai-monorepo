import express, { Express, Router } from 'express';
import { PointController } from '../../controllers/pointController/point';
import { PointLoginController } from '../../controllers/pointController/pointLogin';
import { PointMemberController } from '../../controllers/pointController/pointMember';
import { PointAccessController } from '../../controllers/pointController/pointAccess';
import { PointRoleController } from '../../controllers/pointController/pointRole';
import { PointDiscordController } from '../../controllers/pointController/pointDiscord';
import { PointContractController } from '../../controllers/pointController/pointContract';
import { PointTelegramController } from '../../controllers/pointController/telegram';
import { PointCustomProductController } from '../../controllers/pointController/customProduct';
import { PointCustomMemberController } from '../../controllers/pointController/customMember';
import { PointCustomEventsController } from '../../controllers/pointController/customEvents';
import { PointTwitterController } from '../../controllers/pointController/twitter';
import { PointTwitterMemberController } from '../../controllers/pointController/twitterMember';
import { PointTwitterPointsController } from '../../controllers/pointController/twitterPoints';

export class PointsRouter {
    app: Express;
    private router: Router;
    pointController: PointController;
    pointLoginController: PointLoginController;
    pointMemberController: PointMemberController;
    pointAccessController: PointAccessController;
    pointRoleController: PointRoleController;
    pointDiscordController: PointDiscordController;
    pointContractController: PointContractController;
    pointTelegramController: PointTelegramController;
    pointCustomProductController: PointCustomProductController;
    pointCustomMemberController: PointCustomMemberController;
    pointCustomEventsController: PointCustomEventsController;
    pointTwitterController: PointTwitterController;
    pointTwitterMemberController: PointTwitterMemberController;
    pointTwitterPointsController: PointTwitterPointsController;

    constructor(app: Express) {
        this.app = app;

        this.router = express.Router();
        this.pointController = new PointController();
        this.pointLoginController = new PointLoginController();
        this.pointMemberController = new PointMemberController();
        this.pointAccessController = new PointAccessController();
        this.pointRoleController = new PointRoleController();
        this.pointDiscordController = new PointDiscordController();
        this.pointContractController = new PointContractController();
        this.pointTelegramController = new PointTelegramController();
        this.pointCustomProductController = new PointCustomProductController();
        this.pointCustomMemberController = new PointCustomMemberController();
        this.pointCustomEventsController = new PointCustomEventsController();
        this.pointTwitterController = new PointTwitterController();
        this.pointTwitterMemberController = new PointTwitterMemberController();
        this.pointTwitterPointsController = new PointTwitterPointsController();
    }

    pointsRouter = () => {
        // Login
        this.router.post('/login', this.pointLoginController.login);
        this.router.post('/sendverificationmail', this.pointLoginController.sendEmailVerificationMail);
        this.router.post('/verifyemail', this.pointLoginController.verifyEmail);
        this.router.post('/linkdiscord', this.pointLoginController.linkDiscordPoints);

        // Point
        this.router.post('/add', this.pointController.addPoint);
        this.router.post('/linkdiscordbot/:point_id/:guild_id', this.pointController.linkdiscordbotForPoint);
        this.router.get('/getpointbyid/:point_id', this.pointController.getPointByPointId);
        this.router.post('/merge', this.pointController.merge);
        this.router.post('/mergeV2', this.pointController.mergeV2);
        this.router.get('/getpointsbywallet/:wallet_address', this.pointController.getPointByWallet);

        // Point Member
        this.router.post('/member/fetch', this.pointMemberController.fetchMember);
        this.router.post('/member/update/name&email', this.pointMemberController.UpdateNameAndEmail);
        this.router.post('/member/update/isonboarded', this.pointMemberController.UpdateIsOnboarded);
        this.router.get('/member/list/:pointId', this.pointMemberController.getPointMembers);
        this.router.post('/member/addpoint', this.pointMemberController.CreatePointForMember);
        this.router.get('/member/getpoint/:member_id', this.pointMemberController.GetPointForMember);
        this.router.get('/member/getActivity/:point_id/:page_number/:limit', this.pointMemberController.GetActivity);
        this.router.get(
            '/member/getMemberActivity/:member_id/:page_number/:limit',
            this.pointMemberController.GetMemberActivity
        );
        this.router.get(
            '/member/getLeaderBoard/:point_id/:page_number/:limit',
            this.pointMemberController.GetLeaderBoard
        );
        this.router.get('/member/getdiscord/:member_id', this.pointMemberController.GetDiscordForMember);
        this.router.get('/member/getMetricsData/:point_id/:days', this.pointMemberController.GetMetricsData);
        this.router.post('/member/linkwallet', this.pointMemberController.LinkWallet);

        // Point Access
        this.router.post('/access/create', this.pointAccessController.createAccess);
        this.router.get('/access/get/:pointId', this.pointAccessController.getAccessForPoint);
        this.router.post('/access/update', this.pointAccessController.updateAccessRole);
        this.router.post('/access/update/allaccess', this.pointAccessController.updateAllAccessRole);
        this.router.delete('/access/delete/:pointId', this.pointAccessController.deleteAccess);
        this.router.get('/access/:pointId/:memberId', this.pointAccessController.getAccessForMember);
        this.router.get(
            '/accessbydiscord&guild/:guildId/:discordUserId',
            this.pointAccessController.getAccessForMemberByGuildId
        );

        // Point Contract
        this.router.post('/contract/add', this.pointContractController.addContract);
        this.router.post('/contract/update', this.pointContractController.updateContract);
        this.router.delete(
            '/contract/delete/:pointId/:contract_address/:topic',
            this.pointContractController.deleteContract
        );

        // Point Roles
        this.router.get('/role/get/:pointId', this.pointRoleController.getDAORole);

        // Point Discord
        this.router.get('/discord/get/guilds/:memberId', this.pointDiscordController.getMemberGuildsForOnboarding);

        // Telegram
        this.router.get('/telegram/add', this.pointTelegramController.addTelegramForMember);
        this.router.post('/telegram/generateOtp', this.pointTelegramController.GenerateOtpForTelegram);
        this.router.get('/telegram/getformember/:memberId', this.pointTelegramController.GetTelegramForMember);
        this.router.get('/telegram/getforpoint/:pointId', this.pointTelegramController.GetTelegramForPoint);
        this.router.post('/telegram/events/add', this.pointTelegramController.AddTelegramEvents);
        this.router.post('/telegram/events/update', this.pointTelegramController.UpdateTelegramEvents);
        this.router.get('/telegram/getevents/:pointId', this.pointTelegramController.GetTelegramEventsForPoint);

        // Point Costum Products
        this.router.post('/customproduct/add', this.pointCustomProductController.addCustomProduct);
        this.router.post('/customproduct/update', this.pointCustomProductController.updateCustomProduct);
        this.router.get(
            '/customproduct/fetchbyproductid/:productId',
            this.pointCustomProductController.getCustomProductById
        );
        this.router.get('/customproduct/fetchbypointid/:pointId', this.pointCustomProductController.getCustomPointById);
        this.router.post('/customproduct/updatestatus', this.pointCustomProductController.updateCustomProductStatus);
        this.router.get(
            '/customproduct/getpointforuser/:productId/:uniqueUserId',
            this.pointCustomProductController.getPointsForUserByProductId
        );

        // Member Product
        this.router.post('/memberproduct/add', this.pointCustomMemberController.addCustomMember);

        // Product Events
        this.router.post('/productevent/add', this.pointCustomEventsController.addProductEvents);
        this.router.post('/productevent/update', this.pointCustomEventsController.updateProductEvents);
        this.router.delete(
            '/productevent/delete/:pointId/:productId/:eventName',
            this.pointCustomEventsController.deleteProductEvents
        );

        // Twitter Oauth
        this.router.post('/twitter/oauth', this.pointTwitterController.twitterOauth);

        // Twitter
        this.router.post('/twitter/add', this.pointTwitterController.addTwitter);
        this.router.post('/twitter/update', this.pointTwitterController.updateTwitter);
        this.router.post('/twitter/updatetokens', this.pointTwitterController.updateTwitterTokens);
        this.router.post('/twitter/updatestatus', this.pointTwitterController.updateTwitterStatus);
        this.router.get('/twitter/getbypointid/:pointId', this.pointTwitterController.getTwitterByPointId);

        // Twitter Member
        this.router.post('/twittermember/add', this.pointTwitterMemberController.addTwitterMember);
        this.router.post('/twittermember/update', this.pointTwitterMemberController.updateTwitterMember);
        this.router.get('/twittermember/getbyid/:memberId', this.pointTwitterMemberController.getTwitterMemberById);

        // Twitter Points
        this.router.post('/twitterpoints/add', this.pointTwitterPointsController.addTwitterPoints);
        this.router.post('/twitterpoints/update', this.pointTwitterPointsController.updateTwitterPoints);
        this.router.get('/twitterpoints/getbyid/:pointId', this.pointTwitterPointsController.getTwitterPointsById);

        this.app.use('/api/point', this.router);
    };
}
