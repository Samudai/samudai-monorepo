import express, { Express, Router } from 'express';

import { FormController } from '../../controllers/formController/form';
import { FormResponseController } from '../../controllers/formController/formResponse';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class FormRouter {
    app: Express;

    private router: Router;

    private formController: FormController;
    private formResponseController: FormResponseController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.formController = new FormController();
        this.formResponseController = new FormResponseController();
    }

    formRouter = () => {
        // Form Routes
        this.router.post('/deal/create', requireVerifyAuth, this.formController.createForm);
        this.router.get('/deal/get/dao/:daoId', requireVerifyAuth, this.formController.getFormByDAO);
        this.router.get('/deal/get/:formId', requireVerifyAuth, this.formController.getFormById);
        this.router.post('/deal/update', requireVerifyAuth, this.formController.updateForm);
        this.router.delete('/deal/delete/:formId', requireVerifyAuth, this.formController.deleteForm);
        this.router.get('/deal/support', requireVerifyAuth, this.formController.getSupportQuestions);

        // Form Response Routes
        this.router.post('/deal/response/create', requireVerifyAuth, this.formResponseController.createResponse);
        this.router.get('/deal/response/get/:responseId', requireVerifyAuth, this.formResponseController.getFormResponse);
        this.router.get('/deal/response/getbyform/:formId', requireVerifyAuth, this.formResponseController.getFormResponseForForm);
        this.router.get('/deal/response/getbydao/:daoId', requireVerifyAuth, this.formResponseController.getResponseByDAOId);
        this.router.delete('/deal/response/delete/:responseId', requireVerifyAuth, this.formResponseController.deleteResponse);

        this.app.use('/api/form', this.router);
    };
}
