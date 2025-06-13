import express, { Express, Router } from 'express';
import { PaymentController } from '../controller/paymentController';
import { TokenGatingController } from '../controller/tokenGatingController';
import { VerifiableCredController } from '../controller/verifiableCredController';

export class Routes {
  app: Express;

  // tokenGatingRouter: Router;
  // verifiableCredRouter: Router;
  // paymentRouter: Router;
  router: Router;

  tokenGatingController: TokenGatingController;
  verifiableCredController: VerifiableCredController;
  paymentController: PaymentController;

  constructor(app: Express) {
    this.app = app;

    // this.tokenGatingRouter = express.Router();
    // this.verifiableCredRouter = express.Router();
    // this.paymentRouter = express.Router();
    this.router = express.Router();

    this.tokenGatingController = new TokenGatingController();
    this.verifiableCredController = new VerifiableCredController();
    this.paymentController = new PaymentController();
  }

  web3Routers = () => {
    //TokenGating
    this.router.post('/tokengating/add', this.tokenGatingController.addTokenGating);
    this.router.get('/tokengating/get/:daoId', this.tokenGatingController.getTokenGating);
    this.router.delete('/tokengating/delete/:daoId', this.tokenGatingController.deleteTokenGating);

    //VerifiableCred
    this.router.post('/verifiablecred/add', this.verifiableCredController.addVerifiableCred);
    this.router.get('/verifiablecred/get/:memberId', this.verifiableCredController.getVerifiableCred);

    //Payment
    this.router.post('/payment/add', this.paymentController.addPayment);
    this.router.get('/payment/get/:daoId', this.paymentController.getPlatformPaymentsForDAO);
    this.router.get('/payment/get/member/:memberId', this.paymentController.getPlatformPaymentsByReceiver);
    this.router.get('/payment/get/task/:taskId', this.paymentController.getPlatformPaymentsByTaskId);
    this.router.get('/payment/get/payment/:paymentId', this.paymentController.getPaymentById);
    this.router.post('/payment/update/status', this.paymentController.updatePaymentStatus);

    this.app.use('/web3', this.router);

  };

  routesConfig = () => {
    this.web3Routers();

    this.app.get('/health', (req, res) => {
      res.send('service-activity is running!');
    });

    this.app.get('*', (req, res) => {
      res.send({ message: 'Page not found' });
    });
  };
}
