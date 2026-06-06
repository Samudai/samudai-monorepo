import 'elastic-apm-node/start';
import { Server } from './server';

const server: Server = new Server();
server.startServer();
server.stopServer();
