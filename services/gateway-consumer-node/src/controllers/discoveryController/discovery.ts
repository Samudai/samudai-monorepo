import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, FetchSuccess, AddSuccess } from '../../lib/helper/Responsehandler';
import {
    DAOEvent,
    DiscoverDAOResponse,
    DiscoverMemberResponse,
    MemberEvent,
    MostActiveResponse,
    MostViewedResponse,
    NewView,
} from '@samudai_xyz/gateway-consumer-types';

export class DiscoveryController {
    discoverDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // to get ismember for Dao members
            var member_id = req.params.memberId;
            if (member_id === ':memberId') {
                member_id = null!;
            }

            // todo: optimize this
            const query: string = req.query.query?.toString() ? req.query.query.toString() : '';
            let queryTags: string = req.query.tags as string;
            let queryTypes: string = req.query.types as string;
            const open_to_collaboration = req.query.open_to_collaboration
                ? req.query.open_to_collaboration === 'true'
                    ? true
                    : false
                : null;
            const sort = req.query.sort ? req.query.sort : '';
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 30;
            const offset = (parseInt(page) - 1) * limit;
            const tags = queryTags ? queryTags.split(',') : [];
            const types = queryTypes ? queryTypes.split(',') : [];
            let daoSearchResult;

            let otcFiler = false;

            if (open_to_collaboration != null) {
                otcFiler = true;
            }

            if (query === '') {
                daoSearchResult = await axios.post(`${process.env.SERVICE_DAO}/dao/search`, {
                    query,
                    limit,
                    offset,
                    tags,
                    types,
                    open_to_collaboration,
                    otcFiler,
                    member_id,
                    sort,
                });
            } else {
                daoSearchResult = await axios.post(`${process.env.SERVICE_DAO}/dao/search`, {
                    query,
                    limit,
                    offset,
                    tags,
                    types,
                    open_to_collaboration,
                    otcFiler,
                    member_id,
                    sort,
                });
            }

            // const discovery = await axios.post(`${process.env.SERVICE_DISCOVERY}/discovery/dao`, {});
            // let discoveryList: DiscoverDAOResponse[] = [];
            // if (daoSearchResult.data.daos) {
            //     daoSearchResult.data?.daos.forEach((dao: any) => {
            //         const discoveryDao = discovery.data?.find((d: DiscoverDAOResponse) => d.dao_id === dao.dao_id);
            //         discoveryList.push({
            //             dao_id: dao.dao_id,
            //             name: dao.name,
            //             profile_picture: dao.profile_picture,
            //             projects_ongoing: discoveryDao?.projects_ongoing ? discoveryDao.projects_ongoing : 0,
            //             projects_completed: discoveryDao?.projects_completed ? discoveryDao.projects_completed : 0,
            //         });
            //     });
            // }
            new FetchSuccess(res, 'Discovery DAO', daoSearchResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch discovery'));
        }
    };

    discoverMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // to get isconnect for connections
            var member_id = req.params.memberId;
            if (member_id === ':memberId') {
                member_id = null!;
            }

            // filters
            const query: string = req.query.query?.toString() ? req.query.query.toString() : '';
            let querySkills: string = req.query.skills as string;
            let queryTags: string = req.query.tags as string;
            const open_for_opportunity = req.query.open_for_opportunity
                ? req.query.open_for_opportunity === 'true'
                    ? true
                    : false
                : null;
            const sort = req.query.sort ? req.query.sort : '';
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 30;
            const offset = (parseInt(page) - 1) * limit;
            const skills = querySkills ? querySkills.split(',') : [];
            const tags = queryTags ? queryTags.split(',') : [];

            let ofoFilter = false;

            if (open_for_opportunity != null) {
                ofoFilter = true;
            }

            const memberSearchResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/search`, {
                query,
                skills: skills,
                team: [],
                limit,
                offset,
                tags,
                open_for_opportunity,
                ofoFilter,
                member_id,
                sort,
            });
            // const discovery = await axios.post(`${process.env.SERVICE_DISCOVERY}/discovery/member`, {});
            // let discoveryList: DiscoverMemberResponse[] = [];
            // memberSearchResult.data?.forEach((member: any) => {
            //     const discoveryMember = discovery.data?.find(
            //         (d: DiscoverMemberResponse) => d.member_id === member.member_id
            //     );
            //     discoveryList.push({
            //         member_id: member.member_id,
            //         name: member.name,
            //         profile_picture: member.profile_picture,
            //         username: member.username,
            //         skills: member.skills,
            //         tasks_ongoing: discoveryMember?.tasks_ongoing ? discoveryMember.tasks_ongoing : 0,
            //         tasks_completed: discoveryMember?.tasks_completed ? discoveryMember.tasks_completed : 0,
            //         badges_earned: discoveryMember?.badges_earned ? discoveryMember.badges_earned : 0,
            //     });
            // });

            new FetchSuccess(res, 'Discovery Member', memberSearchResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not fetch discovery'));
        }
    };

    createDAOEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const event: DAOEvent = req.body.event;
            const result = await axios.post(`${process.env.SERVICE_DISCOVERY}/events/dao/create`, {
                event: event,
            });
            new CreateSuccess(res, 'Discovery DAO Event', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create discovery event'));
        }
    };

    createMemberEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const event: MemberEvent = req.body.event;
            const result = await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
                event: event,
            });
            new CreateSuccess(res, 'Discovery Member Event', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create discovery event'));
        }
    };

    fetchTags = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;

            const daoResult1 = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostactive/dao`);
            const mostActiveDAO: MostActiveResponse = daoResult1.data.data;

            const daoResult2 = await axios.get(`${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/dao`);
            const mostViewedDAO: MostViewedResponse = daoResult2.data.data;

            const contributorResult1 = await axios.get(
                `${process.env.SERVICE_ACTIVITY}/engagement/mostactive/contributor`
            );
            const mostActiveContributor: MostActiveResponse = contributorResult1.data.data;

            const contributorResult2 = await axios.get(
                `${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/contributor`
            );
            const mostViewedContributor: MostViewedResponse = contributorResult2.data.data;

            const dao_ids: string[] = [];
            const member_ids: string[] = [];

            if (mostActiveDAO || mostViewedDAO) {
                if (mostActiveDAO && mostActiveDAO?.link_id) {
                    dao_ids.push(mostActiveDAO.link_id);
                }

                if (mostViewedDAO && mostViewedDAO?.link_id) {
                    dao_ids.push(mostViewedDAO.link_id);
                }
            }

            if (mostActiveContributor || mostViewedContributor) {
                if (mostActiveContributor && mostActiveContributor?.link_id) {
                    member_ids.push(mostActiveContributor.link_id);
                }

                if (mostViewedContributor && mostViewedContributor?.link_id) {
                    member_ids.push(mostViewedContributor.link_id);
                }
            }

            const daoInfoResult = await axios.post(`${process.env.SERVICE_DAO}/dao/getbulkdaofordiscovery`, {
                dao_ids,
                member_id,
            });

            const memberInfoResult = await axios.post(
                `${process.env.SERVICE_MEMBER}/member/getbulkmembersfordiscovery`,
                {
                    member_ids,
                    member_id,
                }
            );

            const mostActiveDAOData: any = [];
            const mostViewedDAOData: any = [];
            const mostActiveContributorData: any = [];
            const mostViewedContributorData: any = [];

            daoInfoResult.data?.data?.forEach((daoInfo: any) => {
                if (daoInfo.dao_id === mostActiveDAO.link_id) {
                    mostActiveDAOData.push(daoInfo);
                }
                if (daoInfo.dao_id === mostViewedDAO.link_id) {
                    mostViewedDAOData.push(daoInfo);
                }
            });

            memberInfoResult.data?.data?.forEach((memberInfo: any) => {
                if (memberInfo.member_id === mostActiveContributor.link_id) {
                    mostActiveContributorData.push(memberInfo);
                }
                if (memberInfo.member_id === mostViewedContributor.link_id) {
                    mostViewedContributorData.push(memberInfo);
                }
            });

            const result = {
                mostActiveDAO: mostActiveDAOData,
                mostViewedDAO: mostViewedDAOData,
                mostActiveContributor: mostActiveContributorData,
                mostViewedContributor: mostViewedContributorData,
            };

            new CreateSuccess(res, 'Discovery Member Event', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not create discovery event'));
        }
    };

    addDiscoveryViews = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newView: NewView = req.body.newView;
            const result = await axios.post(`${process.env.SERVICE_ACTIVITY}/viewcount/discovery/add`, {
                type: newView.type,
                link_id: newView.link_id,
            });
            new AddSuccess(res, 'Discovery View', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Could not add discovery views'));
        }
    };
}
