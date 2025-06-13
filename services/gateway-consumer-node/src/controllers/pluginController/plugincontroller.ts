import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { mapMemberToUsername } from '../../lib/memberUtils';
import { Plugin, PluginsEnums } from '@samudai_xyz/gateway-consumer-types';

export class PluginController {
    getPluginListForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id = req.params.linkId;
            const pluginList: Plugin[] = [];

            //notion
            const notionResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/notion/exists/${link_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.NOTION,
                connected: notionResult.data.exists,
            });

            const gcalResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/gcal/exists/${link_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.GCAL,
                connected: gcalResult.data.exists,
                value: gcalResult.data.email,
            });

            const githubResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/githubapp/exists/${link_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.GITHUBAPP,
                connected: githubResult.data.exists,
                value: githubResult.data.username,
            });

            const twitterResult = await axios.get(`${process.env.SERVICE_TWITTER}/twitter/verified/${link_id}`);
            if (twitterResult.data.data) {
                pluginList.push({
                    pluginType: PluginsEnums.PluginType.TWITTER,
                    connected: true,
                    value: twitterResult.data.data.twitter.username,
                });
            } else {
                pluginList.push({
                    pluginType: PluginsEnums.PluginType.TWITTER,
                    connected: false,
                });
            }

            const daoResult = await axios.get(`${process.env.SERVICE_DAO}/dao/${link_id}`);
            daoResult.data.dao.guild_id !== ''
                ? pluginList.push({
                      pluginType: PluginsEnums.PluginType.DISCORD,
                      connected: true,
                      value: daoResult.data.dao.name,
                  })
                : pluginList.push({
                      pluginType: PluginsEnums.PluginType.DISCORD,
                      connected: false,
                  });
            daoResult.data.dao.snapshot
                ? pluginList.push({
                      pluginType: PluginsEnums.PluginType.SNAPSHOT,
                      connected: true,
                      value: daoResult.data.dao.snapshot,
                  })
                : pluginList.push({
                      pluginType: PluginsEnums.PluginType.SNAPSHOT,
                      connected: false,
                  });

            const daoProviders = await axios.get(`${process.env.SERVICE_DAO}/provider/list/${link_id}`);
            if (daoProviders.data.provider_list) {
                const gnosisProvider = daoProviders.data.provider_list.find(
                    (provider: any) => provider.provider_type === 'gnosis'
                );
                if (gnosisProvider) {
                    pluginList.push({
                        pluginType: PluginsEnums.PluginType.GNOSIS,
                        connected: true,
                        value: gnosisProvider.address,
                    });
                } else {
                    pluginList.push({
                        pluginType: PluginsEnums.PluginType.GNOSIS,
                        connected: false,
                    });
                }
            } else {
                pluginList.push({
                    pluginType: PluginsEnums.PluginType.GNOSIS,
                    connected: false,
                });
            }

            return res.status(200).send({
                message: 'Plugin List',
                data: pluginList,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Plugin List failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Plugins',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getPluginListForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const pluginList: Plugin[] = [];

            //notion
            const notionResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/notion/exists/${member_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.NOTION,
                connected: notionResult.data.exists,
            });

            const gcalResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/gcal/exists/${member_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.GCAL,
                connected: gcalResult.data.exists,
                value: gcalResult.data.email,
            });

            const githubResult = await axios.get(`${process.env.SERVICE_PLUGIN}/plugins/github/exists/${member_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.GITHUB,
                connected: githubResult.data.exists,
                value: githubResult.data.username,
            });

            // const memberInfo = await mapMemberToUsername(member_id);
            // if (memberInfo) {
            //     pluginList.push({
            //         pluginType: PluginType.DISCORD,
            //         connected: true,
            //         value: memberInfo.discord.username,
            //     });
            // }

            const discord = await axios.get(`${process.env.SERVICE_MEMBER}/member/discord/exist/${member_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.DISCORD,
                connected: discord.data.exist,
                value: discord.data.username,
            });

            const telegram = await axios.get(`${process.env.SERVICE_MEMBER}/telegram/exist/${member_id}`);
            pluginList.push({
                pluginType: PluginsEnums.PluginType.TELEGRAM,
                connected: telegram.data.exist,
                value: telegram.data.username,
            });
            // const twitterResult = await axios.get(`${process.env.SERVICE_TWITTER}/twitter/verified/${link_id}`);
            // if (twitterResult.data.data) {
            //     pluginList.push({
            //         pluginType: PluginType.TWITTER,
            //         connected: true,
            //         value: twitterResult.data.data.twitter.username,
            //     });
            // } else {
            //     pluginList.push({
            //         pluginType: PluginType.TWITTER,
            //         connected: false,
            //     });
            // }

            return res.status(200).send({
                message: 'Plugin List',
                data: pluginList,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Plugin List failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Plugins',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
