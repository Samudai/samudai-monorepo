import express, { Express, Router } from 'express';
import { ParcelController } from '../../controllers/parcelController/parcel';

export class ParcelRouter {
    app: Express;
    private router: Router;

    private parcelController: ParcelController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.parcelController = new ParcelController();
    }

    parcelRouter = () => {
        this.router.post('/parcel/create', this.parcelController.createTx);
        this.router.post('/parcel/get/balance', this.parcelController.getSafeBalance);
        this.router.post('/parcel/get/safes', this.parcelController.getSafes);
        this.router.post('/parcel/get/safeInfo', this.parcelController.getSafeInfo);
        this.router.post('/parcel/get/status', this.parcelController.getProposalStatus);

        this.app.use('/api', this.router);
    };
}
