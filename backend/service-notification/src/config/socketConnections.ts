import { createAdapter } from '@socket.io/redis-adapter';
import { generateSessionId } from '../controllers/socketControllers.ts/utils/helpers';
import { redis } from './redisConfig';
import { RedisSessionStore } from '../lib/redisSession';
import { RedisFunctions } from '../lib/redis';
import {
  WebNotification,
  NotificationPartialData,
  ErrorResponse,
} from '../controllers/socketControllers.ts/utils/types';

import { ProjectSockets } from '../controllers/socketControllers.ts/projectManagement/projectSockets';
import { PaymentSockets } from '../controllers/socketControllers.ts/Payment/paymentSockets';
import { JobSockets } from '../controllers/socketControllers.ts/Job/jobSockets';
import { ForumSockets } from '../controllers/socketControllers.ts/Forum/forumSockets';
import { DaoSockets } from '../controllers/socketControllers.ts/Dao/daoSockets';
import { ContributorSockets } from '../controllers/socketControllers.ts/Contributor/contributorSockets';
import { GeneralSockets } from '../controllers/socketControllers.ts/General/generalSockets';
import { DiscoverySockets } from '../controllers/socketControllers.ts/Discovery/discoverySockets';
import { ChatSockets } from '../controllers/socketControllers.ts/Chat/chatSockets';
export class SocketConnections {
  ioSocket: any;
  projectSockets: ProjectSockets;
  paymentSockets: PaymentSockets;
  jobSockets: JobSockets;
  forumSockets: ForumSockets;
  daoSockets: DaoSockets;
  contributorSockets: ContributorSockets;
  generalSockets: GeneralSockets;
  discoverySockets: DiscoverySockets;
  chatSockets: ChatSockets;

  constructor(ioSocket: any) {
    this.ioSocket = ioSocket;

    this.projectSockets = new ProjectSockets();
    this.paymentSockets = new PaymentSockets();
    this.jobSockets = new JobSockets();
    this.forumSockets = new ForumSockets();
    this.daoSockets = new DaoSockets();
    this.contributorSockets = new ContributorSockets();
    this.generalSockets = new GeneralSockets();
    this.discoverySockets = new DiscoverySockets();
    this.chatSockets = new ChatSockets();
  }

  setSocketConnections = () => {
    //Redis
    const redisClient = redis;

    const pubClient = redisClient;
    const subClient = redisClient!.duplicate();

    const redisSession = new RedisSessionStore(redisClient);
    const redisFunc = new RedisFunctions();

    // Fan socket emits out across instances via Redis pub/sub so the service
    // can run multiple replicas behind the load balancer.
    this.ioSocket.adapter(createAdapter(pubClient, subClient));

    const users: any[] = [];
    //Sockets
    this.ioSocket.use(async (socket: any, next: (err?: Error) => void) => {
      const sessionId = socket.handshake.auth.sessionId;
      if (sessionId) {
        const session = await redisSession.findSession(sessionId); //Redissession
        socket.sessionId = sessionId;
        socket.memberId = session.memberId;
        socket.username = session.username;
        return next();
      }

      const memberId = socket.handshake.auth.memberId;
      if (!memberId) {
        return next(new Error('Unauthorized'));
      }
      socket.sessionId = generateSessionId();
      socket.memberId = memberId;
      socket.member = `member:${memberId}:member`; //username
      next();
    });

    this.ioSocket.on('connection', async (socket: any) => {
      //persist session

      const res = await redisSession.saveSession(socket.sessionId, {
        memberId: socket.memberId,
        member: socket.member,
        connected: true,
      });

      socket.join(socket.memberId);

      console.log('connected', socket.memberId);

      this.ioSocket.to(socket.memberId).emit('memberConnected', {
        memberId: socket.memberId,
      });
      const memberExists = await redisClient!.exists(socket.member);
      if (!memberExists) {
        const member = await redisFunc.createMember(socket.memberId);
        console.log('member', member);
        this.ioSocket.to(socket.memberId).emit('memberCreated', member);
      }

      this.ioSocket.to(socket.memberId).emit('memberConnected', {
        memberId: socket.memberId,
        username: socket.member,
        sessionId: socket.sessionId,
      });

      socket.on('dao_change', (dao_id: string, role: string) => {
        socket.join(`dao:${dao_id}:${role}`);
      });
      // const sessions = await redisSession.findAllSessions();
      // sessions.forEach((session: any) => {
      //   users.push({
      //     memberId: session.memberId,
      //     member: session.member,
      //     connected: session.connected,
      //   });
      // });

      // socket.emit('users', users);

      // SocketConnections

      this.projectSockets.projectNotifications(this.ioSocket, socket, redisFunc);
      this.paymentSockets.paymentNotifications(this.ioSocket, socket, redisFunc);
      this.jobSockets.jobNotifications(this.ioSocket, socket, redisFunc);
      this.forumSockets.forumNotifications(this.ioSocket, socket, redisFunc);
      this.daoSockets.daoNotification(this.ioSocket, socket, redisFunc);
      this.contributorSockets.contributorNotifications(this.ioSocket, socket, redisFunc);
      this.generalSockets.generalNotifications(this.ioSocket, socket, redisFunc);
      this.discoverySockets.discoveryNotifications(this.ioSocket, socket, redisFunc);
      this.chatSockets.chatNotification(this.ioSocket, socket, redisFunc);

      // socket.on('group_notification', async (notification: Notification, members: string[]) => {
      //   for (const member of members) {
      //     notification.to = member;
      //     await redisFunc.publishNotification(notification);
      //     this.ioSocket.to(notification.to).emit('notification', notification);
      //   }
      // });

      socket.on('disconnect', async () => {
        const matchingSockets = await this.ioSocket.in(socket.memberId).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          // notify other users
          //socket.broadcast.emit('user disconnected', socket.userID);
          // update the connection status of the session
          redisSession.saveSession(socket.sessionID, {
            memberId: socket.memberId,
            member: socket.member,
            connected: false,
          });
        }
      });
    });
  };
}
