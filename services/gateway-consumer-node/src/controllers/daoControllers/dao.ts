import axios from 'axios';
import { Request, Response } from 'express';
import { getDAOForMember, getDAOInfo } from '../../lib/daoHelpers';
import {
    Dashboard,
    DAOSocial,
    MembersEnums,
    DAO,
    MemberDAOView,
    Project,
    ProjectEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { completeOnboarding } from '../../lib/onboarding';
import { upload } from '../../lib/profilePhotoUpload';

export class DAOProfileController {
    createDAOProfile = async (req: Request, res: Response) => {
        try {
            const daoProfile: DAO = req.body.daoProfile;
            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/create`, {
                dao: daoProfile,
            });

            return res.status(200).send({
                message: 'DAO created successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while creating a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getDAOProfile = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/${daoId}`);
            return res.status(200).send({
                message: 'DAO fetched successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getDAObyGuildId = async (req: Request, res: Response) => {
        try {
            const guildId = req.params.guildId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/byguildid/${guildId}`);
            if (result.data.dao) {
                return res.status(200).send({
                    message: 'DAO fetched successfully',
                    data: result.data,
                });
            } else {
                return res.status(200).send({
                    message: 'DAO fetched successfully',
                    data: null,
                });
            }
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getDAOForMember = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.memberId;
            const result = await getDAOForMember(memberId);
            return res.status(200).send({
                message: 'DAO fetched successfully',
                data: result,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateDAOProfile = async (req: Request, res: Response) => {
        try {
            const daoProfile: DAO = req.body.daoProfile;
            const socials: DAOSocial[] = req.body.socials;
            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update`, {
                dao: daoProfile,
            });

            if (socials) {
                try {
                    const socialUpdateResult = await axios.post(`${process.env.SERVICE_DAO}/social/update`, {
                        social: socials,
                    });
                } catch (err: any) {
                    if (err.response) {
                        return res.status(err.response.status).send({
                            message: 'Something went wrong while updating socials of the dao',
                            error: err.response.data,
                        });
                    } else {
                        return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
                    }
                }
            }

            return res.status(201).send({
                message: 'DAO updated successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    deleteDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/dao/delete/${daoId}`);
            return res.status(200).send({
                message: 'DAO deleted successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while deleting a dao', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getMembersByAccess = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const access = req.params.access;
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/members/${daoId}/${access}`);
            return res.status(200).send({
                message: 'DAO admins fetched successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching dao admins', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    addSnapshot = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const snapshot = req.body.snapshot ? req.body.snapshot : null;
            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/snapshot`, {
                dao_id,
                snapshot: snapshot,
            });
            return res.status(201).send({
                message: 'Snapshot added successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while adding a snapshot', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getLatestDAOForMember = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/bymemberid/${memberId}`);
            const daos: MemberDAOView[] = result.data.dao;

            // console.log(result.data.dao);

            if (daos && daos.length > 0) {
                const dao_id = daos.find((dao) => dao.onboarding === false)?.dao_id;

                return res.status(200).send({
                    message: 'DAO fetched successfully',
                    data: dao_id,
                });
            }
            return res.status(200).send({
                message: 'DAO fetched successfully',
                data: null,
            });
        } catch (err: any) {
            //console.log(err);
            if (err.response) {
                return res.status(200).send({
                    message: 'DAO not fetched successfully',
                    data: null,
                });
            } else {
                return res.status(200).send({
                    message: 'DAO not fetched successfully',
                    data: null,
                });
            }
        }
    };

    updateOnBoardingForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const onboarding = req.body.onboarding;
            const member_id = req.body.member_id;
            const memberOnboarded = req.body.memberOnboarded;
            let adminOnboardingComplete: any;

            // if (!memberOnboarded) {
            //     try {
            //         adminOnboardingComplete = await completeOnboarding({
            //             member_id,
            //             admin: true,
            //             contributor: false,
            //             invite_code: '',
            //         });
            //     } catch (err) {
            //         return res
            //             .status(500)
            //             .send({ message: 'Error completing admin onboarding', error: JSON.stringify(err) });
            //     }
            // }

            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/onboarding`, {
                dao_id,
                onboarding,
            });

            const dao = await getDAOInfo(dao_id);

            if (onboarding === true && result.status === 200) {
                const project: Project = {
                    link_id: dao_id,
                    type: ProjectEnums.LinkType.DAO,
                    project_type: ProjectEnums.ProjectType.INTERNAL,
                    title: `${dao.name} Task Board`,
                    description: 'DAO Internal project Board',
                    visibility: ProjectEnums.Visibility.PUBLIC,
                    created_by: member_id,
                    completed: false,
                    pinned: true,
                };

                const projectResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/create`, {
                    project,
                });

                // const access: DAOAccess = {
                //     id: '',
                //     dao_id: dao_id,
                //     access: AccessType.MANAGE_DAO,
                //     members: [member_id],
                //     roles: [],
                // };

                // const accessResult = await axios.post(`${process.env.SERVICE_DAO}/access/create`, {
                //     access,
                // });

                // const daoRoles = await axios.get(`${process.env.SERVICE_DAO}/role/list/${dao_id}`);
                // let roles: string[] = [];

                // daoRoles.data.roles.forEach((role: DAORole) => {
                //     roles.push(role.role_id);
                // });

                // const viewAccess: DAOAccess = {
                //     id: '',
                //     dao_id: dao_id,
                //     access: AccessType.VIEW,
                //     members: [member_id],
                //     roles: roles,
                // };

                // const viewAccessResult = await axios.post(`${process.env.SERVICE_DAO}/access/create`, {
                //     access: viewAccess,
                // });

                const daoDashboard: Dashboard = {
                    dao_id: dao_id,
                    dashboard_name: 'DAO Dashboard',
                    description: 'DAO Default Dashboard',
                    default: true,
                    visibility: 'public',
                };

                const dashboardResult = await axios.post(`${process.env.SERVICE_DASHBOARD}/dashboard/create`, {
                    dashboard: daoDashboard,
                });

                const addAdminData = await axios.post(
                    `${process.env.SERVICE_ACTIVITY}/admins/dao/add`, {
                        admin : {
                            member_id,
                            dao_id,
                            type_of_member: memberOnboarded ? 'contributor' : 'admin',
                        }
                });

                // const deleteOnboarding = await axios.delete(
                //     `${process.env.SERVICE_ACTIVITY}/onboarding/delete/${dao_id}`
                // );


                return res.status(201).send({
                    message: 'Dao And Member Onboarding Complete',
                    data: result.data,
                    adminOnboarding: adminOnboardingComplete,
                });
            } else {
                return res.status(400).send({
                    message: 'Onboarding Failed',
                    data: null,
                });
            }
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating onboarding', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updatePFPForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const nftProfileLink = req.body.nftProfileLink;
            const typeOfProfilePicture: string = req.body.typeOfProfilePicture;
            let profilePicture;
            if (req.files) {
                profilePicture = req.files.file;
            }

            let profilePictureUrl: string = '';
            if (parseInt(typeOfProfilePicture) === MembersEnums.ProfilePicture.Photo && profilePicture) {
                const result = await upload(profilePicture);
                profilePictureUrl = result!;
            } else {
                profilePictureUrl = nftProfileLink;
            }

            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/profile_picture`, {
                dao_id,
                profile_picture: profilePictureUrl,
            });

            return res.status(201).send({
                message: 'Profile Picture updated successfully for DAO',
                data: result.data,
                profilePicture: profilePictureUrl,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating profile picture', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    updateTagsForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const tags = req.body.tags;

            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/tags`, {
                dao_id,
                tags,
            });

            return res.status(201).send({
                message: 'Tags updated successfully for DAO',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while updating Tags', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    listTags = async (req: Request, res: Response) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_DAO}/tag/list`);

            return res.status(201).send({
                message: 'DAO Tags fetched successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching DAO tags', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    claimSubdomainForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const subdomain = req.body.subdomain;
            const provider_address = req.body.providerAddress;

            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/claimsubdomain`, {
                dao_id,
                subdomain,

                provider_address,
            });

            return res.status(201).send({
                message: 'Subdomain successfully requested for DAO',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while requesting subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    checkSubdomainForDAO = async (req: Request, res: Response) => {
        try {
            const subdomain = req.params.subdomain;

            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/checksubdomain/${subdomain}`);

            return res.status(201).send({
                message: 'Subdomain successfully checked for DAO',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while checking subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getBulkDaoForDiscovery = async (req: Request, res: Response) => {
        try {
            const dao_ids: string[] = req.body.daoIds;
            const member_id: string = req.body.memberId;
            const result = await axios.post(`${process.env.SERVICE_DAO}/dao/getbulkdaofordiscovery`, {
                dao_ids,
                member_id,
            });
            return res.status(201).send({
                message: 'Dao Info successfully fetched',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching daos', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    linkdiscordbotForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id: string = req.params.dao_id;
            const guild_id: string = req.params.guild_id;
            const result = await axios.post(`${process.env.SAMUDAI_BOT}/linkdiscord/dao/${dao_id}/${guild_id}`);
            return res.status(201).send({
                message: 'Dao Info successfully fetched',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching daos', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    fetchSubdomainByDAOId = async (req: Request, res: Response) => {
        try {
            const dao_id = req.params.daoId;

            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/fetchsubdomainfordao/${dao_id}`);

            return res.status(201).send({
                message: 'Subdomain successfully fetched for DAO',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getSubscriptionForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id = req.params.daoId;

            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/getsubscription/fordao/${dao_id}`);

            return res.status(201).send({
                message: 'Subscription successfully fetched for DAO',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching subscription', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
