import express, { Express, Router } from 'express';
import { stripeController } from '../../controllers/stripeController/stripeController';

export class StripeRouter {
    app: Express;
    private router: Router;
    stripeController : stripeController

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();

        this.stripeController = new stripeController();
    }

    stripeRouter = () => {
        this.router.post('/api/stripe/webhook', express.raw({ type: "application/json" }), this.stripeController.webhook);
        this.router.get('/api/stripe/managesubscription/:daoId',  this.stripeController.getPaymentLinkForDAO)
        this.router.post('/api/stripe/firsttime/checkout', this.stripeController.getFirstTimeCheckout);
        this.router.get('/api/stripe/usedlimits/:daoId', this.stripeController.getUsedLimitsForDao);

        this.app.use(this.router);
    };
}
