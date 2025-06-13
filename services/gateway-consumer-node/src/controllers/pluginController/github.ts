import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

export class GithubController {
    serviceGithub = `${process.env.SERVICE_PLUGIN}/plugins/github`;
    serviceGithubApp = `${process.env.SERVICE_PLUGIN}/plugins/githubapp`;

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.member_id;
            const code = req.body.code;
            const redirectUri = req.body.redirectUri;
            const response = await axios.post(`${this.serviceGithub}/auth`, {
                member_id,
                code,
                redirect_uri: redirectUri,
            });
            // let onboardingStatus = false;

            // const onboardingResult = await axios.get(`${process.env.SERVICE_MEMBER}/onboarding/${member_id}`);

            // if (onboardingResult.data) {
            //     if (
            //         onboardingResult.data.onboarding.admin === false &&
            //         onboardingResult.data.onboarding.contributor === false
            //     ) {
            //         onboardingStatus = false;
            //     } else if (
            //         onboardingResult.data.onboarding.admin === true ||
            //         onboardingResult.data.onboarding.contributor === true
            //     ) {
            //         onboardingStatus = true;
            //     } else {
            //         onboardingStatus = false;
            //     }
            // } else {
            //     onboardingStatus = false;
            // }

            // if (!onboardingStatus) {
            //     const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //         link_id: member_id,
            //         step_id: MemberOnboardingFlowStep.INTEGRATIONS,
            //         value: {
            //             github: {
            //                 code: code,
            //                 redirect_uri: redirectUri,
            //             },
            //         },
            //     });
            // }

            return res.status(200).send({
                message: 'Github Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Github Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    appauth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.dao_id;
            const code: string = req.body.code;
            const installation_id: number = req.body.installation_id;
            const setup_action: string = req.body.setup_action;
            const state: string = req.body.state;
            const redirect_uri: string = req.body.redirectUri;

            const response = await axios.post(`${this.serviceGithubApp}/auth`, {
                dao_id,
                code,
                installation_id,
                setup_action,
                state,
                redirect_uri,
            });
            return res.status(200).send({
                message: 'Github App Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Github App Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    memberExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const response = await axios.get(`${this.serviceGithub}/exists/${member_id}`);
            return res.status(200).send({
                message: 'Member exists successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Member exists failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    daoExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const response = await axios.get(`${this.serviceGithubApp}/exists/${dao_id}`);
            return res.status(200).send({
                message: 'DAO exists successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'DAO exists failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getRepos = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const response = await axios.get(`${this.serviceGithubApp}/getrepos/${dao_id}`);
            return res.status(200).send({
                message: 'Get Repos successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Get Repos failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    fetchIssues = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.dao_id;
            const github_repos: string[] = req.body.github_repos;
            const response = await axios.post(`${this.serviceGithubApp}/fetchissues`, {
                dao_id,
                github_repos,
            });
            return res.status(200).send({
                message: 'Fetch Issues successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Fetch Issues failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    fetchPullRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id: string = req.body.dao_id;
            const github_repos: string[] = req.body.github_repos;
            const response = await axios.post(`${this.serviceGithubApp}/fetchpullrequests`, {
                dao_id,
                github_repos,
            });
            return res.status(200).send({
                message: 'Fetch Pull Requests successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Fetch Pull Requests failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    deleteGithubForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const response = await axios.delete(`${this.serviceGithub}/${member_id}`);
            return res.status(200).send({
                message: 'Delete Github for Member successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Delete Github for Member failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    deleteGithubApp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dao_id = req.params.daoId;
            const response = await axios.delete(`${this.serviceGithubApp}/${dao_id}`);
            return res.status(200).send({
                message: 'Delete Github App successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Delete Github App failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from github',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
