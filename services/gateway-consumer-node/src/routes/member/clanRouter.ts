import express, { Express, Router } from 'express';
import { ClansController } from '../../controllers/memberController/clans';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class ClanRouter {
    app: Express;
    private router: Router;
    private clanController: ClansController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.clanController = new ClansController();
    }

    clanRouter = () => {
        this.router.post('/create', requireVerifyAuth, this.clanController.createClan);
        this.router.post('/addmember', requireVerifyAuth, this.clanController.addClanMember);
        this.router.get('/get/:clanId', requireVerifyAuth, this.clanController.getClan);
        this.router.post('/update', requireVerifyAuth, this.clanController.updateClan);
        this.router.delete('/delete/:clanId', requireVerifyAuth, this.clanController.deleteClan);
        this.router.delete('/removemember/:clanId/:memberId', requireVerifyAuth, this.clanController.removeClanMember);
        this.router.get('/get/bymember/:memberId', this.clanController.getClansByMember);

        //Clan invites
        this.router.post('/invite/create', requireVerifyAuth, this.clanController.createClanInvite);
        this.router.get('/invite/get/:clanId', requireVerifyAuth, this.clanController.getClanInvite);
        this.router.post('/invite/update', requireVerifyAuth, this.clanController.updateClanInvite);
        this.router.delete('/invite/delete/:inviteId', requireVerifyAuth, this.clanController.deleteClanInvite);
        this.router.get(
            '/invite/receiver/:receiverId',
            requireVerifyAuth,
            this.clanController.getClanInviteForReceiver
        );

        this.app.use('/api/clan', this.router);
    };
}
