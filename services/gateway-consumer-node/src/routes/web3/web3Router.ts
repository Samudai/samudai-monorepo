import express, { Express, Router } from 'express';
import { TokenGatingController } from '../../controllers/web3Controller/tokenGatingController';
import { VerifiableCredController } from '../../controllers/web3Controller/verifiableCredController';
import { Web3Controller } from '../../controllers/web3Controller/web3Controller';
import { manageDAOAccess, viewAccess } from '../../middlewares/DAORoleAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class Web3Router {
    app: Express;
    private router: Router;
    private tokenGatingController: TokenGatingController;
    private verifiableCredController: VerifiableCredController;
    private web3Controller: Web3Controller;

    constructor(app: Express) {
        this.app = app;

        this.router = express.Router();
        this.tokenGatingController = new TokenGatingController();
        this.verifiableCredController = new VerifiableCredController();
        this.web3Controller = new Web3Controller();
    }

    web3Router = () => {
        //Project
        this.router.post('/api/web3/tokengating/add', manageDAOAccess, this.tokenGatingController.addTokenGating);
        this.router.get('/api/web3/tokengating/get/:daoId', viewAccess, this.tokenGatingController.getTokenGating);
        this.router.delete(
            '/api/web3/tokengating/delete/:daoId',
            manageDAOAccess,
            this.tokenGatingController.deleteTokenGating
        );

        //VerifiableCred
        this.router.post(
            '/api/web3/verifiablecred/add',
            requireVerifyAuth,
            this.verifiableCredController.addVerifiableCred
        );
        this.router.get(
            '/api/web3/verifiablecred/get/:memberId',
            requireVerifyAuth,
            this.verifiableCredController.getVerifiableCred
        );

        this.router.get('/api/web3/token/get/:address', requireVerifyAuth, this.web3Controller.getTokenFromContract);

        this.app.use(this.router);
    };
}
