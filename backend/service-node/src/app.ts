import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";

import { Routes as ActivityRoutes } from "./activity/routes/routes";
import { Routes as TwitterRoutes } from "./twitter/router/routes";
import { Routes as Web3Routes } from "./web3/routes/routes";
import { Routes as XRoutes } from "./x/routes/routes";

import { initMongo, closeMongo } from "./x/utils/mongo";
import mqConnection from "./x/config/rabbitmqConfig";
import { closeConnections } from "./db/connections";

import "dotenv/config";

// Server hosts the four former Node micro-services in one process. Each is
// mounted under a distinct prefix so the gateway reaches it via
// SERVICE_<X>=http://service-node:8080/<x>-svc with no caller code change.
export class Server {
  app: Express;
  server: any;

  constructor() {
    this.app = express();
  }

  private config = () => {
    this.app.use(express.json());
    this.app.set("trust proxy", true);
    this.app.use(cors({ credentials: true }));
    this.app.use(morgan("short"));
  };

  private routes = () => {
    const activityRouter = express.Router();
    new ActivityRoutes(activityRouter).routesConfig();
    this.app.use("/activity-svc", activityRouter);

    const twitterRouter = express.Router();
    new TwitterRoutes(twitterRouter).routesConfig();
    this.app.use("/twitter-svc", twitterRouter);

    const web3Router = express.Router();
    new Web3Routes(web3Router).routesConfig();
    this.app.use("/web3-svc", web3Router);

    const xRouter = express.Router();
    new XRoutes(xRouter).routesConfig();
    this.app.use("/x-svc", xRouter);

    this.app.get("/health", (_req, res) => {
      res.send("service-node is running!");
    });
    this.app.use((_req, res) => {
      res.status(404).send({ message: "Page not found" });
    });
  };

  startServer = async () => {
    this.config();
    this.routes();

    // service-x uses the native MongoDB driver with dynamic database selection.
    await initMongo();

    this.server = this.app.listen(process.env.PORT, () => {
      console.log("service-node is running on port", process.env.PORT);
    });

    // service-x RabbitMQ publisher — non-fatal if the broker is unreachable.
    mqConnection.connect().catch((err: unknown) => {
      console.error("RabbitMQ connect failed (non-fatal):", err);
    });
  };

  stopServer = () => {
    process.on("SIGINT", () => {
      console.info("SIGINT signal received. Closing service-node.");
      if (!this.server) {
        process.exit(0);
      }
      this.server.close(async () => {
        await closeConnections().catch(() => undefined);
        await closeMongo().catch(() => undefined);
        process.exit(0);
      });
    });
  };
}
