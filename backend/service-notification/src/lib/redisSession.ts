import { MemberSession } from '../controllers/socketControllers.ts/utils/types';

/* abstract */ class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, session: MemberSession) {}
  findAllSessions() {}
}

const mapSession = (memberSession: string[]) =>
  memberSession[0] ? { memberId: memberSession[0], member: memberSession[1], connected: 'true' } : undefined;

export class RedisSessionStore extends SessionStore {
  private redisClient: any;
  constructor(redisClient: any) {
    super();
    this.redisClient = redisClient;
  }

  findSession(sessionId: string) {
    // this.redisClient.hgetall(`session:${id}`).then((result) => {
    // 	console.log(result);
    // });
    return this.redisClient.hmget(`session:${sessionId}`, 'memberId', 'member', 'connected').then(mapSession);
  }
  async saveSession(sessionId: string, memberSession: MemberSession) {
    const key = `session:${sessionId}`;

    const hsetResult = await this.redisClient.hset(
      key,
      'memberId',
      memberSession.memberId,
      'member',
      memberSession.member,
      'connected',
      memberSession.connected,
    );

    await this.redisClient.expire(key, 1800); // 30 minutes in seconds

    return hsetResult;
  }
  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(nextIndex, 'MATCH', 'session:*', 'COUNT', '100');
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s: any) => keys.add(s));
    } while (nextIndex !== 0);
    const commands: any[] = [];
    keys.forEach((key) => {
      commands.push(['hmget', key, 'memberId', 'member', 'connected']);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results: any) => {
        return results.map(([err, session]: any) => (err ? undefined : mapSession(session))).filter((v: any) => !!v);
      });
  }
}
