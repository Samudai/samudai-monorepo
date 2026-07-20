import express, { Router } from "express";
import { ActivityController } from "../controller/activityController";

export class Routes {
  app: Router;

  activityRouter: Router;

  activityController: ActivityController;

  constructor(app: Router) {
    this.app = app;

    this.activityRouter = express.Router();

    this.activityController = new ActivityController();
  }

  activityRouters = () => {
    //Activity Routes
    this.activityRouter.post(
      "/fetch",
      this.activityController.fetchNewTwitterActivity,
    );

    this.app.use("/activity", this.activityRouter);
  };

  routesConfig = () => {
    this.activityRouters();
  };
}
