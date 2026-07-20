import "elastic-apm-node/start";
import { Server } from "./app";

const server: Server = new Server();
server.startServer();
server.stopServer();
