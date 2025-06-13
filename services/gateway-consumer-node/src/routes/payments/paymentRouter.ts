import express, { Express, Router } from 'express';
import { PaymentController } from '../../controllers/paymentController/payment';
import { ProviderController } from '../../controllers/paymentController/provider';
import { manageDAOAccess, viewAccess } from '../../middlewares/DAORoleAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class PaymentRouter {
    app: Express;
    private router: Router;
    private paymentController: PaymentController;
    private providerController: ProviderController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.paymentController = new PaymentController();
        this.providerController = new ProviderController();
    }

    paymentRouter = () => {
        //Payment
        this.router.post('/payment/add', this.paymentController.addPayment);
        this.router.get('/payment/get/dao/:daoId', viewAccess, this.paymentController.getPlatformPaymentsForDAO);
        this.router.get(
            '/payment/get/member/:memberId',
            requireVerifyAuth,
            this.paymentController.getPlatformPaymentsForMember
        );
        this.router.get('/payment/get/task/:taskId', requireVerifyAuth, this.paymentController.getPaymentForTask);
        this.router.get('/payment/get/payment/:paymentId', requireVerifyAuth, this.paymentController.getPayment);
        this.router.post('/payment/update/status', requireVerifyAuth, this.paymentController.updateStatus);
        this.router.get(
            '/payment/get/uninitiatedfordao/:daoId',
            requireVerifyAuth,
            this.paymentController.getUninitiatedByDAOId
        );

        //Provider
        this.router.post('/provider/create', this.providerController.create);
        this.router.get('/provider/get/:providerId', requireVerifyAuth, this.providerController.getProviderById);
        this.router.get('/provider/get/dao/:daoId', requireVerifyAuth, this.providerController.getProviderForDAO);
        this.router.post('/provider/update', manageDAOAccess, this.providerController.updateProvider);
        this.router.delete('/provider/delete/:providerId', manageDAOAccess, this.providerController.deleteProvider);
        this.router.get(
            '/provider/get/default/:daoId',
            requireVerifyAuth,
            this.providerController.getDAODefaultProvider
        );
        this.router.get('/provider/exists/:providerId', requireVerifyAuth, this.providerController.doesExistProvider);
        this.router.post('/provider/update/default', manageDAOAccess, this.providerController.updateDefaultProvider);

        this.router.get('/chain/list', requireVerifyAuth, this.providerController.getChainList);

        this.app.use('/api', this.router);
    };
}
