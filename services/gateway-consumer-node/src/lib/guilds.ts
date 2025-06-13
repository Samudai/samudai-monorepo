import { Guilds, GuildInfoResponse, MemberGuilds } from '@samudai_xyz/gateway-consumer-types';
import axios from 'axios';
import { getNextStepForDAO } from './nextstep';

export const getGuildsWithSteps = async (member_id: string) => {
    try {
        let memberGuilds: MemberGuilds = {};

        const guildsResult = await axios.get(`${process.env.SERVICE_DISCORD}/discord/guildadmin/${member_id}`);

        const guilds: Guilds[] = guildsResult.data;

        const guildsInfo: GuildInfoResponse[] = guilds?.map((guild) => {
            return {
                label: guild.name,
                value: guild.id,
            };
        });

        if (guildsResult.data) {
            try {
                for (const guild of guilds) {
                    const daoInfo = await axios.get(`${process.env.SERVICE_DAO}/dao/byguildid/${guild.id}`);
                    if (daoInfo.data.dao) {
                        if (daoInfo.data.dao.onboarding) {
                            memberGuilds[guild.id] = {
                                id: guild.id,
                                name: guild.name,
                                dao_id: daoInfo.data.dao.dao_id,
                                isOnboarded: true,
                                onboardingIntegration: null,
                                onboardingData: null,
                            };
                        } else {
                            const { nextStep, onboardingData, onboardingIntegration } = await getNextStepForDAO(
                                daoInfo.data.dao.dao_id
                            );
                            memberGuilds[guild.id] = {
                                id: guild.id,
                                name: guild.name,
                                dao_id: daoInfo.data.dao.dao_id,
                                isOnboarded: false,
                                onboardingIntegration: onboardingIntegration,
                                onboardingData: onboardingData,
                                goTo: nextStep,
                            };
                        }
                    } else {
                        memberGuilds[guild.id] = {
                            id: guild.id,
                            name: guild.name,
                            isOnboarded: false,
                            onboardingIntegration: null,
                            onboardingData: null,
                        };
                    }
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        return {
            guildsInfo: guildsInfo,
            memberGuilds: memberGuilds,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getPointGuilds = async (member_id: string) => {
    try {
        let memberGuilds: any[] = [];

        const guildsResult = await axios.get(`${process.env.SERVICE_DISCORD}/point/discord/guildadmin/${member_id}`);

        const guilds: Guilds[] = guildsResult.data;

        const guildsInfo: GuildInfoResponse[] = guilds?.map((guild) => {
            return {
                label: guild.name,
                value: guild.id,
            };
        });

        if (guildsResult.data) {
            try {
                for (const guild of guilds) {
                    const pointInfo = await axios.get(`${process.env.SERVICE_POINT}/point/pointid/${guild.id}`);

                    console.log(pointInfo.data);

                    if (pointInfo.data.point) {
                        memberGuilds.push({
                            guildid: guild.id,
                            name: guild.name,
                            isOnboarded: true,
                        });
                    } else {
                        memberGuilds.push({
                            guildid: guild.id,
                            name: guild.name,
                            isOnboarded: false,
                        });
                    }
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        return {
            memberGuilds: memberGuilds,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
