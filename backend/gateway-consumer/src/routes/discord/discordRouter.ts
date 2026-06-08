import express, { Express, Router } from 'express';
import { DiscordController } from '../../controllers/discordController/discord';

export class DiscordRouter {
    app: Express;
    private router: Router;
    private discordController: DiscordController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.discordController = new DiscordController();
    }

    discordRouter = () => {
        this.router.get('/get/events/byguild/:guildId', this.discordController.getEventsByGuildId);
        this.router.get('/get/events/bymember/:memberId', this.discordController.getEventsByMemberId);
        this.router.get('/get/guilds/:memberId', this.discordController.getMemberGuildsForOnboarding);
        this.router.delete('/disconnect/:memberId', this.discordController.disconnectDiscord);
        this.router.post('/reconnect', this.discordController.reconnectDiscord);
        this.app.use('/api/discord', this.router);
    };
}
