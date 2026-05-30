import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { getGuildsWithSteps } from '../../lib/guilds';
import { DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { MemberDiscord, MembersEnums } from '@samudai_xyz/gateway-consumer-types';

export class DiscordController {
    getEventsByGuildId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const guildId: string = req.params.guildId;
            const response = await axios.get(`${process.env.SERVICE_DISCORD}/event/byguildid/${guildId}`);
            new FetchSuccess(res, 'Events', response);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching events'));
        }
    };

    getEventsByMemberId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const memberResponse = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                type: MembersEnums.FetchMemberType.MEMBER_ID,
                member_id: memberId,
            });

            // todo: check the logic of validating discord response
            const memberData = memberResponse.data.member;
            if (memberData.discord?.discord_user_id) {
                const userId: string = memberData.discord.discord_user_id;

                const response = await axios.get(`${process.env.SERVICE_DISCORD}/event/byuserid/${userId}`);
                new FetchSuccess(res, 'EVENTS', response);
            }
            new FetchSuccess(res, 'Events', []);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching events'));
        }
    };

    getMemberGuildsForOnboarding = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;

            const { guildsInfo, memberGuilds } = await getGuildsWithSteps(member_id);

            new FetchSuccess(res, 'Guilds', { guildsInfo, memberGuilds });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching events'));
        }
    };

    disconnectDiscord = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.params.memberId;

            const result = await axios.delete(`${process.env.SERVICE_DISCORD}/discord/disconnect/${memberId}`);
            axios.delete(`${process.env.SERVICE_MEMBER}/member/discord/${memberId}`);

            new DeleteSuccess(res, 'Disconnect', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Disconnecting or Deleting data of Discord'));
        }
    };

    reconnectDiscord = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const code = req.body.code;
            const redirectUri = req.body.redirectUri;

            const discordResult = await axios.post(`${process.env.SERVICE_DISCORD}/discord/authuser`, {
                member_id: memberId,
                auth_code: code,
                redirect_uri: redirectUri,
            });

            const discord: MemberDiscord = discordResult.data.user_data;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/creatediscord`, {
                member_id: memberId,
                discord: discord,
            });
            if (!result) {
                res.status(500).send({
                    message: 'Error creating member discord',
                });
            }

            return res.status(201).send({
                message: 'Discord reconnected successfully',
                data: discord,
            });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while Reconnecting Discord'));
        }
    };
}
