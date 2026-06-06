import express, { Express, Router } from 'express';
import { AccessController } from '../../controllers/amsController/accessRole';
import { ProjectAccessController } from '../../controllers/amsController/projectAccess';
import { manageDAOAccess, manageProjectAccess, viewAccess } from '../../middlewares/DAORoleAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class AccessRouter {
    app: Express;
    private accessRouter: Router;
    private projectAccessRoleRouter: Router;
    private accessController: AccessController;
    private projectAccessController: ProjectAccessController;

    constructor(app: Express) {
        this.app = app;
        this.accessRouter = express.Router();
        this.projectAccessRoleRouter = express.Router();
        this.accessController = new AccessController();
        this.projectAccessController = new ProjectAccessController();
    }

    accessrouter = () => {
        //Access Roles
        this.accessRouter.post('/create', manageDAOAccess, this.accessController.createAccess);
        this.accessRouter.get('/get/:daoId', viewAccess, this.accessController.getAccessForDAO);
        this.accessRouter.post('/update', manageDAOAccess, this.accessController.updateAccessRole);
        this.accessRouter.post('/update/allaccess', manageDAOAccess, this.accessController.updateAllAccessRole);
        this.accessRouter.delete('/delete/:daoId', manageDAOAccess, this.accessController.deleteAccess);
        this.accessRouter.get('/:daoId/:memberId', requireVerifyAuth, this.accessController.getAccessForMember);

        //Project Access
        this.projectAccessRoleRouter.post(
            '/create',
            manageProjectAccess,
            this.projectAccessController.createProjectAccess
        );
        this.projectAccessRoleRouter.get(
            '/get/:projectId',
            viewAccess,
            this.projectAccessController.getProjectAccessForProjectId
        );
        this.projectAccessRoleRouter.post(
            '/update',
            manageProjectAccess,
            this.projectAccessController.updateProjectAccess
        );
        this.projectAccessRoleRouter.delete(
            '/delete/:projectId',
            manageProjectAccess,
            this.projectAccessController.deleteProjectAccess
        );
        this.projectAccessRoleRouter.post(
            '/get/bymember',
            requireVerifyAuth,
            this.projectAccessController.getProjectAccessForMember
        );

        this.projectAccessRoleRouter.post(
            '/update/access',
            manageProjectAccess,
            this.projectAccessController.updateProjectAccessVisbility
        );

        //Adding the accessRoleRouter to the app
        this.app.use('/api/access', this.accessRouter);
        this.app.use('/api/projectaccess', this.projectAccessRoleRouter);
    };
}
