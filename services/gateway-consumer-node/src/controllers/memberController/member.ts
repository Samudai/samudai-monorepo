import {
    FeaturedProjects,
    Member,
    MemberFetch,
    MemberFilter,
    MembersEnums,
    Onboarding,
    Social,
} from '@samudai_xyz/gateway-consumer-types';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ogs from 'open-graph-scraper';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import { deleteMemberFromRedis } from '../../lib/memberUtils';
import { upload } from '../../lib/profilePhotoUpload';
import { daoOnboarding, daoOnboardingComplete } from '../../lib/onboarding';


export class MemberController {
    fetchMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member: MemberFetch = req.body.member;
            let member_id = '';
            let username = '';
            let wallet_address = '';
            let discord_user_id = '';
            let memberResult: any;
            if (member.type === MembersEnums.FetchMemberType.MEMBER_ID) {
                member_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.MEMBER_ID,
                    member_id,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.USERNAME) {
                username = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.USERNAME,
                    username,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.WALLET_ADDRESS) {
                wallet_address = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.WALLET_ADDRESS,
                    wallet_address,
                });
                memberResult = result.data;
            } else if (member.type === MembersEnums.FetchMemberType.DISCORD_ID) {
                discord_user_id = member.value;
                const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/fetch`, {
                    type: MembersEnums.FetchMemberType.DISCORD_ID,
                    discord_user_id,
                });
                memberResult = result.data;
            }
            if (memberResult) {
                const socialsResult = await axios.get(
                    `${process.env.SERVICE_MEMBER}/social/list/${memberResult.member.member_id}`
                );
                memberResult.socials = socialsResult.data.socials;
            }
            new FetchSuccess(res, 'MEMBER', memberResult!);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member'));
        }
    };

    updateMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member: Member = req.body.member;
            const socials: Social[] = req.body.socials;
            const memberUpdateResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/update`, {
                member,
            });

            const socialUpdateResult = await axios.post(`${process.env.SERVICE_MEMBER}/social/update`, {
                socials,
            });

            const clearRedis = await deleteMemberFromRedis(member.member_id);

            if (clearRedis) {
                new UpdateSuccess(res, 'MEMBER', { member: member, socials: socials });
            }
            return res.status(500).send({ message: 'Internal server error', error: 'Redis error' });
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member'));
        }
    };

    updateMemberHourlyRate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.member_id;
            const currency = req.body.currency;
            const hourly_rate = req.body.hourly_rate;
            const memberUpdateResult = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/rate`, {
                member_id: memberId,
                currency: currency,
                hourly_rate: hourly_rate,
            });
            new UpdateSuccess(res, 'MEMBER HOURLY RATE', memberUpdateResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating hourly rate for member'));
        }
    };

    UpdateMemberOpportunityStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.member_id;
            const open_for_opportunity = req.body.open_for_opportunity;
            const memberUpdateOpportunityResult = await axios.post(
                `${process.env.SERVICE_MEMBER}/member/update/opportunitystatus`,
                {
                    member_id: memberId,
                    open_for_opportunity: open_for_opportunity,
                }
            );
            new UpdateSuccess(res, 'MEMBER OPPORTUNITY STATUS', memberUpdateOpportunityResult);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating opportunity status for member'));
        }
    };

    deleteMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.delete(`${process.env.SERVICE_MEMBER}/member/${memberId}`);
            new DeleteSuccess(res, 'MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a member'));
        }
    };

    getMembersBulk = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_ids: string[] = req.body.memberIds;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/getbulkbyid`, {
                member_ids,
            });
            new FetchSuccess(res, 'MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching members'));
        }
    };

    getMemberbyDiscord = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const discordId = req.params.discordId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/bydiscorduserid/${discordId}/`);
            new FetchSuccess(res, 'MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member'));
        }
    };

    getMemberWorkProgress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/workprogress/${member_id}`);
            new FetchSuccess(res, 'MEMBER Work Progress', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member work progress'));
        }
    };

    filterMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filter: MemberFilter = req.body.filter;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/filter`, {
                filter,
            });
            new FetchSuccess(res, 'MEMBERS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching members'));
        }
    };
    checkUserName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const username = req.params.username;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/username/exist/${username}`);
            new FetchSuccess(res, 'MEMBER', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member'));
        }
    };

    createProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;
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

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/profilepicture`, {
                member_id: member_id,
                url: profilePictureUrl,
            });

            // const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //     link_id: member_id,
            //     step_id: MemberOnboardingFlowStep.PROFILE_PICTURE_USERNAME,
            //     value: {
            //         profile_picture: profilePictureUrl,
            //     },
            // });

            new CreateSuccess(res, 'MEMBER PROFILE PICTURE', profilePictureUrl);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a member profile picture'));
        }
    };

    updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;
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

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/profilepicture`, {
                member_id: member_id,
                url: profilePictureUrl,
            });

            new UpdateSuccess(res, 'MEMBER PROFILE PICTURE', profilePictureUrl);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member profile picture'));
        }
    };

    updateSubdomainForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const subdomain = req.body.subdomain;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/subdomain`, {
                member_id: memberId,
                subdomain: subdomain,
            });
            new UpdateSuccess(res, 'MEMBER SUBDOMAIN', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member'));
        }
    };

    updateClaimNFT = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/onboarding/requestnft`, {
                member_id: memberId,
            });
            new UpdateSuccess(res, 'MEMBER NFT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while requesting nft'));
        }
    };

    updateEmailForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const email = req.body.email;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/email`, {
                member_id: memberId,
                email
            });
            new UpdateSuccess(res, 'MEMBER Email', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating Email'));
        }
    }

    isEmailUpdated = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.member_id;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/is/emailupdated/${member_id}`);
            new FetchSuccess(res, 'MEMBER IsEmailUpdated', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while requesting IsUpdatedEmail'));
        }
    }

    getBulkMembersForDiscovery = async (req: Request, res: Response) => {
        try {
            const member_ids: string[] = req.body.memberIds;
            const member_id: string = req.body.memberId;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/getbulkmembersfordiscovery`, {
                member_ids,
                member_id,
            });
            return res.status(201).send({
                message: 'Members Info successfully fetched',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching members', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    getBulkTelelegramChatIds = async (req: Request, res: Response) => {
        try {
            const member_ids: string[] = req.body.memberIds;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/getbulktelegramchatids`, {
                member_ids,
            });
            return res.status(201).send({
                message: 'TelelegramChatIds Info successfully fetched',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching members', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    addDaoForMember = async (req: Request, res: Response) => {
        try {
            const member_id: string = req.body.memberId;
            const value = req.body.value;

            const daoId = await daoOnboarding(member_id, value)

            const daoOnbComplete = await daoOnboardingComplete(daoId, member_id);

            return res.status(201).send({
                message: 'Member Onboarding completed successfully ',
                data: {
                    daoId: daoId,
                    daoOnboardingComplete: daoOnbComplete
                },
            });
        } catch (err: any) {
            if (err.response) {
                // Handle Axios errors with response status
                return res
                    .status(err.response.status)
                    .send({ message: `Error: ${err.message}`, data: err.response.data });
            } else if (err.request) {
                // Handle Axios errors without response (e.g., network error)
                return res.status(500).send({ message: 'Network error', error: err.message });
            } else {
                // Handle other errors
                return res.status(500).send({ message: 'Internal server error', error: err.message });
            }
        }
    };

    getInviteCountForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.params.memberId;
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/invitecount/${memberId}`);
            new FetchSuccess(res, 'MEMBER INVITE COUNT', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member'));
        }
    };

    updateSkillsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.memberId;
            const skills: string[] = req.body.skills;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/skills`, {
                member_id: memberId,
                skills: skills,
            });
            new UpdateSuccess(res, 'MEMBER SKILLS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member skills'));
        }
    };

    updateDomainTagsWorkForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.member_id;
            const domain_tags_for_work: string[] = req.body.domain_tags_for_work;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/domaintags`, {
                member_id: memberId,
                domain_tags_for_work: domain_tags_for_work,
            });
            new UpdateSuccess(res, 'MEMBER DOMAIN TAGS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member domain tags'));
        }
    };

    updateFeaturedProjectsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.member_id;
            const featured_projects: FeaturedProjects[] = req.body.featured_projects;

            const options = { url: featured_projects[featured_projects.length - 1].url };
            const scrapperInfo = await ogs(options);

            console.log(scrapperInfo.result);

            featured_projects[featured_projects.length - 1].metadata = scrapperInfo.result;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/featuredprojects`, {
                member_id: memberId,
                featured_projects: featured_projects,
            });
            new UpdateSuccess(res, 'MEMBER FEATURED PROJECTS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member featured projects'));
        }
    };

    listSkills = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/skill/list`);
            new FetchSuccess(res, 'MEMBER SKILLS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member skills'));
        }
    };

    listDomainsForWorkTags = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/domaintags/list`);
            new FetchSuccess(res, 'MEMBER DOMAIN TAGS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member domain tags'));
        }
    };

    updateTagsForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.memberId;
            const tags: string[] = req.body.tags;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/tags`, {
                member_id: memberId,
                tags: tags,
            });
            new UpdateSuccess(res, 'MEMBER Tags', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member tags'));
        }
    };

    listTags = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/tag/list`);
            new FetchSuccess(res, 'MEMBER TAGS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a member tags'));
        }
    };

    updateNameAndPfpForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.memberId;
            const name: string = req.body.name;
            const profile_picture: string = req.body.profilePicture;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/name&pfp`, {
                member_id: memberId,
                name,
                profile_picture,
            });
            new UpdateSuccess(res, 'MEMBER Name', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member tags'));
        }
    };

    updateOnBoarding = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const onBoarding: Onboarding = req.body.onBoarding;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/onboarding`, {
                onboarding: onBoarding,
            });
            new UpdateSuccess(res, 'MEMBER ONBOARDING', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a member onboarding'));
        }
    };

    updateMemberOriginalName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId: string = req.body.memberId;
            const name: string = req.body.name;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/userorignialname`, {
                member_id: memberId,
                name,
            });
            new UpdateSuccess(res, 'MEMBER Name', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating member tags'));
        }
    };

    updateCeramicStream = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.body.memberId;
            const ceramic_stream = req.body.streamId;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/ceramicstream`, {
                member_id: member_id,
                ceramic_stream: ceramic_stream,
            });
            new UpdateSuccess(res, 'CERAMIC STREAM', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while updating a ceramic stream'));
        }
    };

    getAllContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/get/all/contributors`);
            new FetchSuccess(res, 'CONTRIBUTORS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching all contributors'));
        }
    };

    getAllOpenToWorkContributor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_MEMBER}/member/get/all/contributors/open_to_work`);
            new FetchSuccess(res, 'CONTRIBUTORS', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching all contributors'));
        }
    };

    uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let file;

            if (req.files) {
                file = req.files.file;
            }

            let fileUrl: string = '';
            if (file) {
                const result = await upload(file);
                fileUrl = result!;
            }

            new CreateSuccess(res, 'File Uploaded Successfully', fileUrl);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching all contributors'));
        }
    };
}
