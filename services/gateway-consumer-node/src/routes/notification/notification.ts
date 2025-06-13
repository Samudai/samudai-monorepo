import express, { Express, Router } from 'express';
import { TaskController } from '../../controllers/projectController/task';

export class NotificationRouter {
    app: Express;
    private router: Router;
    private taskController: TaskController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.taskController = new TaskController();
    }

    notificationRouter = () => {
        //Notification
        this.router.get('/notification/task/:taskId', this.taskController.getTaskById);

        this.app.use('/api', this.router);
    };
}
