import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';
import { DAO, MemberResponse, UniversalSearchResponse } from '@samudai_xyz/gateway-consumer-types';

export class SearchController {
    memberSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let query = decodeURIComponent(req.params.query as string);
            let querySkills: string = req.query.skills as string;
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const skills = querySkills ? querySkills.split(',') : [];
            const memberSearchResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/search`, {
                query,
                skills: skills,
                team: [],
                limit,
                offset,
            });
            new FetchSuccess(res, 'MEMBER Searched /', memberSearchResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while searching'));
        }
    };

    daoSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let query = decodeURIComponent(req.params.query);
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const daoSearchResult = await axios.post(`${process.env.SERVICE_DAO}/dao/search`, {
                query: query,
                limit: limit,
                offset: offset,
            });
            new FetchSuccess(res, 'DAO Searched /', daoSearchResult.data.daos);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while searching'));
        }
    };

    daoMemberSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //Get the DAO ID from the request
            const daoId = decodeURIComponent(req.params.daoId as string);
            const query = decodeURIComponent(req.query.query as string);
            console.log(daoId, query);
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;

            //Get the uuids for the users in the DAO

            const daoMembersResult = await axios.get(`${process.env.SERVICE_DAO}/member/listuuid/${daoId}`);

            const daoMembers = daoMembersResult.data;

            const daoMemberSearchResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/search`, {
                query: query ? query : '',
                skills: [],
                team: daoMembers,
                limit: limit,
                offset: offset,
            });
            new FetchSuccess(res, 'DAO MEMBER Searched /', daoMemberSearchResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while searching'));
        }
    };

    projectSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = decodeURIComponent(req.params.query);
            //console.log(query);
            const dao_id = (req.query.daoId as string) ? (req.query.daoId as string) : null;

            if (dao_id) {
                const projectSearchResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/search`, {
                    query: query,
                    dao_id: dao_id,
                });
                new FetchSuccess(res, 'PROJECT Searched /', projectSearchResult.data.projects);
            } else {
                const projectSearchResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/search`, {
                    query: query,
                });
                new FetchSuccess(res, 'PROJECT Searched /', projectSearchResult.data.projects);
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while searching'));
        }
    };

    universalSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = decodeURIComponent(req.params.query);
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 5;
            const offset = (parseInt(page) - 1) * limit;
            let universalSearchResponse: UniversalSearchResponse[] = [];

            const memberSearchResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/search`, {
                query,
                skills: [],
                team: [],
                limit,
                offset,
            });

            if (memberSearchResult.data) {
                memberSearchResult.data.map((member: MemberResponse) => {
                    universalSearchResponse.push({
                        type: 'member',
                        name: member.name ? member.name : 'Unknown',
                        id: member.member_id,
                        profile_picture: member.profile_picture ? member.profile_picture : '',
                        username: member.username,
                    });
                });
            }

            const daoSearchResult = await axios.post(`${process.env.SERVICE_DAO}/dao/search`, {
                query: query,
                limit: limit,
                offset: offset,
            });

            if (daoSearchResult.data.daos) {
                daoSearchResult.data.daos.map((dao: DAO) => {
                    universalSearchResponse.push({
                        type: 'dao',
                        name: dao.name,
                        id: dao.dao_id,
                        profile_picture: dao.profile_picture ? dao.profile_picture : '',
                    });
                });
            }
            new FetchSuccess(res, 'Universal Search', universalSearchResponse);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while searching'));
        }
    };
}
