import express, { Express, Router } from 'express';
import { DashBoardController } from '../../controllers/dashboardController/dashboard';
import { DashBoardWidgetController } from '../../controllers/dashboardController/dashboardWidgetController';
import { dashbhoardViewAccess, manageDAOAccess, viewAccess } from '../../middlewares/DAORoleAuth';

export class DashboardRouter {
    app: Express;
    private dashboardRouter: Router;
    private dashboardController: DashBoardController;

    private dashboardWidgetController: DashBoardWidgetController;

    constructor(app: Express) {
        this.app = app;
        this.dashboardRouter = express.Router();
        this.dashboardController = new DashBoardController();
        this.dashboardWidgetController = new DashBoardWidgetController();
    }

    dashboardrouter = () => {
        //dashboard
        this.dashboardRouter.post('/create', manageDAOAccess, this.dashboardController.createDashboard);
        this.dashboardRouter.post('/update', manageDAOAccess, this.dashboardController.updateDashboard);
        this.dashboardRouter.post('/update/name', manageDAOAccess, this.dashboardController.updateDashboardName);
        this.dashboardRouter.get('/list/:daoId', dashbhoardViewAccess, this.dashboardController.listDashboardForDAO);
        this.dashboardRouter.delete('/delete/:dashboardId', manageDAOAccess, this.dashboardController.deleteDashboard);
        this.dashboardRouter.post(
            '/update/visibility',
            manageDAOAccess,
            this.dashboardController.updateDashboardVisibility
        );

        //Widgets

        this.dashboardRouter.post('/widget/create', manageDAOAccess, this.dashboardWidgetController.createWidgets);
        this.dashboardRouter.post('/widget/update', manageDAOAccess, this.dashboardWidgetController.updateWidgets);
        this.dashboardRouter.get(
            '/widget/list/:dashboardId',
            viewAccess,
            this.dashboardWidgetController.listWidgetsForDashboard
        );
        this.dashboardRouter.delete(
            '/widget/delete/:widgetId',
            manageDAOAccess,
            this.dashboardWidgetController.deleteWidgets
        );
        this.dashboardRouter.post(
            '/widget/update/active',
            manageDAOAccess,
            this.dashboardWidgetController.updateWidgetActive
        );

        this.app.use('/api/dashboard', this.dashboardRouter);
    };
}
