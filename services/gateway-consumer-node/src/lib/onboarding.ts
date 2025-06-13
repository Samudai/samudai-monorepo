import axios from 'axios';
import {
    DAOEnums,
    ProjectEnums,
    Project,
    ConnectionRequest,
    Onboarding,
    AccessEnums,
    Dashboard,
} from '@samudai_xyz/gateway-consumer-types';
import { getDAOInfo } from './daoHelpers';

export const completeOnboarding = async (onboarding: Onboarding) => {
    try {
        const onBoardingResult = await axios.post(`${process.env.SERVICE_MEMBER}/onboarding/update`, {
            onboarding,
        });

        const project: Project = {
            link_id: onboarding.member_id,
            type: ProjectEnums.LinkType.MEMBER,
            project_type: ProjectEnums.ProjectType.INTERNAL,
            title: 'My Project',
            description: 'My Personal Project Board',
            visibility: ProjectEnums.Visibility.PRIVATE,
            created_by: onboarding.member_id,
            completed: false,
            pinned: true,
        };

        const projectResult = await axios.post(`${process.env.SERVICE_PROJECT}/project/create`, {
            project,
        });

        const project_id = projectResult.data.project_id;

        const senderIds = process.env.DEFAULT_CONNECTION_MEMBERS?.split(',');

        if (senderIds) {
            await Promise.all(
                senderIds.map(async (senderId) => {
                    const connection: ConnectionRequest = {
                        sender_id: senderId,
                        receiver_id: onboarding.member_id,
                        message: "Let's Connect and Embark on an Exciting Journey!",
                        status: DAOEnums.InviteStatus.PENDING,
                    };

                    const result = await axios.post(`${process.env.SERVICE_MEMBER}/connection/create`, {
                        connection: connection,
                    });

                    return result.data;
                })
            );
        }

        const deleteOnboarding = await axios.delete(
            `${process.env.SERVICE_ACTIVITY}/onboarding/delete/${onboarding.member_id}`
        );

        return {
            data: {
                onboarding,
                project_id,
            },
        };
    } catch (err) {
        return err;
    }
};

export const daoOnboarding = async (memberId: string, value: any) => {
    try {
        const result = await axios.post(`${process.env.SERVICE_DAO}/dao/create`, {
            dao: { name: value.dao_name, dao_type: 'general', tags: value.tags },
        });

        const daoId = result.data.dao_id;

        const res1 = await axios.post(`${process.env.SERVICE_DAO}/member/create`, {
            member: {
                dao_id: daoId,
                member_id: memberId,
            },
        });
        
        const res2 = await axios.post(`${process.env.SERVICE_DAO}/access/creatediscord`, {
            dao_id: daoId,            
        });

        const res3 = await axios.post(`${process.env.SERVICE_DAO}/access/addmemberdiscord`, {
            dao_id: daoId,
            access: AccessEnums.AccessType.MANAGE_DAO,
            member_id: memberId,
        });

        return daoId;
    } catch (err) {
        return err;
    }
};

export const daoOnboardingComplete = async (dao_id: string, member_id: string) => {
    try {
        const result = await axios.post(`${process.env.SERVICE_DAO}/dao/update/onboarding`, {
            dao_id,
            onboarding: true,
        });

        const dao = await getDAOInfo(dao_id);

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

        const addAdminData = await axios.post(`${process.env.SERVICE_ACTIVITY}/admins/dao/add`, {
            admin: {
                member_id,
                dao_id,
                type_of_member: 'admin',
            },
        });

        return ({
            message: 'Dao And Member Onboarding Complete',
            data: result.data,
        });
    } catch (err) {
        return err;
    }
};
