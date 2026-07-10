import cron from 'node-cron';
import { RedisFunctions } from '../lib/redis';

export class CronController {
  private redisFunctions: RedisFunctions;

  constructor() {
    this.redisFunctions = new RedisFunctions();
  }

  redisCleanup = async () => {
    cron.schedule('0 0 23 * * *', () => {
      this.redisFunctions.memberNotificationCleanUp();
      this.redisFunctions.notificationCleanUp();
    });
  };
}
