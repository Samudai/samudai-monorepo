import { Express } from 'express';
import { healthCheck, getOwner, linkDiscordToDAO, linkDiscordToPOINT } from '../controllers/discordbot';
import { NotFoundError } from '../errors/notFoundError';

export class Routes {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  routesConfig = () => {
    this.app.get('/health', healthCheck);
    this.app.post('/linkdiscord/dao/:dao_id/:guild_id', linkDiscordToDAO);
    this.app.post('/linkdiscord/point/:point_id/:guild_id', linkDiscordToPOINT);

    this.app.get('*', (req, res) => {
      throw new NotFoundError();
    });
  };
}
