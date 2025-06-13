import axios from 'axios';
import { ProjAccessResponse, AccessResponse, AccessEnums } from '@samudai_xyz/gateway-consumer-types';

// export const mapRolesToUsers = async (discordGuilds: any) => {
//   //const roles: Roles[]

//   for (let i = 0; i < discordGuilds.length; i++) {
//     const result = await axios.post(`${process.env.SERVICE_ACCESS}/access/getaccess/members`, {
//       roleIds: discordGuilds[i].roles,
//     });
//     discordGuilds[i].roles = result.data.data;
//   }

//   return discordGuilds;
// };

// export const getAccessRoles = async (memberId: string, daoId: any) => {
//   try {
//     //1st fetch all roles for the user from service_discord
//     const rolesForMember = await axios.get(`${process.env.SERVICE_DAO}/role/list/${daoId}/${memberId}`);

//     if (rolesForMember.data) {
//       const adminAccessRole = rolesForMember.data.roles.find((role: any) => role.admin === true);
//       if (adminAccessRole) {
//         return {
//           admin: true,
//           view_access: true,
//         };
//       } else {
//         return { view_access: true };
//       }
//     } else {
//       return { admin: false, view_access: false };
//     }
//   } catch (err: any) {
//     console.log('error getting access roles', err);
//     return { admin: false, view_access: false };
//   }

// };

export const getDAOAccessForRole = async (memberId: string, daoId: string): Promise<AccessResponse> => {
    try {
        const accessForMember = await axios.post(`${process.env.SERVICE_DAO}/access/formember`, {
            member_id: memberId,
            dao_id: daoId,
        });

        let data: AccessResponse = {
            access: {
                manage_dao: false,
                view: false,
                manage_project: false,
                manage_payment: false,
                manage_job: false,
                manage_forum: false,
            },
            accessLevel: 'view',
        };
        if (accessForMember.data.includes(AccessEnums.AccessType.MANAGE_DAO)) {
            data.access = {
                manage_dao: true,
                view: true,
                manage_project: true,
                manage_payment: true,
                manage_job: true,
                manage_forum: true,
            };
            data.accessLevel = 'manage_dao';
            return data;
        } else if (
            accessForMember.data.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            accessForMember.data.includes(AccessEnums.AccessType.MANAGE_PAYMENT) ||
            accessForMember.data.includes(AccessEnums.AccessType.MANAGE_JOB) ||
            accessForMember.data.includes(AccessEnums.AccessType.MANAGE_FORUM)
        ) {
            data.access.view = true;
            if (accessForMember.data.includes(AccessEnums.AccessType.MANAGE_PROJECT)) {
                data.access.manage_project = true;
                data.accessLevel = 'manage_project';
            }
            if (accessForMember.data.includes(AccessEnums.AccessType.MANAGE_PAYMENT)) {
                data.access.manage_payment = true;
                data.accessLevel = 'manage_payment';
            }
            if (accessForMember.data.includes(AccessEnums.AccessType.MANAGE_JOB)) {
                data.access.manage_job = true;
                data.accessLevel = 'manage_job';
            }
            if (accessForMember.data.includes(AccessEnums.AccessType.MANAGE_FORUM)) {
                data.access.manage_forum = true;
                data.accessLevel = 'manage_forum';
            }
            return data;
        } else if (accessForMember.data.includes(AccessEnums.AccessType.VIEW)) {
            data.access = {
                manage_dao: false,
                view: true,
                manage_project: false,
                manage_payment: false,
                manage_job: false,
                manage_forum: false,
            };
            data.accessLevel = 'view';
            return data;
        } else {
            if (daoId === process.env.TRIAL_DASHBOARD) {
                data.access = {
                    manage_dao: false,
                    view: true,
                    manage_project: false,
                    manage_payment: false,
                    manage_job: false,
                    manage_forum: false,
                };
                data.accessLevel = 'view';
            }
            return data;
        }
    } catch (err: any) {
        const data: AccessResponse = {
            access: {
                manage_dao: false,
                view: false,
                manage_project: false,
                manage_payment: false,
                manage_job: false,
                manage_forum: false,
            },
            accessLevel: 'view',
        };
        return data;
    }
};

export const getProjectAccess = async (
    memberId: string,
    projectId: string,
    daoId: string
): Promise<ProjAccessResponse> => {
    try {
        const roles = await getRolesForMember(memberId, daoId);
        let memberAccessLevel = '';

        const projectAccessForMember = await axios.post(`${process.env.SERVICE_PROJECT}/access/bymemberid`, {
            project_id: projectId,
            member_id: memberId,
            roles: roles,
        });

        const daoAccessForMember = await axios.post(`${process.env.SERVICE_DAO}/access/formember`, {
            member_id: memberId,
            dao_id: daoId,
        });

        let projectAccessLevel: AccessEnums.ProjectAccessType = AccessEnums.ProjectAccessType.HIDDEN;

        if (projectAccessForMember.data === '') {
            projectAccessLevel = daoAccessForMember.data
                ? AccessEnums.ProjectAccessType.VIEW
                : AccessEnums.ProjectAccessType.HIDDEN;
            const daoAccess = getHighestAccess(daoAccessForMember.data);
            const highestAccessLevel = getAccessLevel(daoAccess, projectAccessLevel);
            memberAccessLevel = highestAccessLevel;
        } else {
            const projectAccess = projectAccessForMember.data;
            const daoAccess = getHighestAccess(daoAccessForMember.data);
            const highestAccessLevel = getAccessLevel(daoAccess, projectAccess);
            memberAccessLevel = highestAccessLevel;
        }

        let data: ProjAccessResponse = {
            access: {
                manage_dao: false,
                view: false,
                create_task: false,
                manage_project: false,
            },
            accessLevel: 'hidden',
        };

        if (
            memberAccessLevel === AccessEnums.ProjectAccessType.MANAGE_PROJECT ||
            memberAccessLevel === AccessEnums.ProjectAccessType.MANAGE_DAO
        ) {
            data.access = {
                manage_dao: true,
                view: true,
                create_task: true,
                manage_project: true,
            };
            data.accessLevel = 'manage_project';
            return data;
        } else if (memberAccessLevel === AccessEnums.ProjectAccessType.CREATE_TASK) {
            data.access = {
                manage_dao: false,
                view: true,
                create_task: true,
                manage_project: false,
            };
            data.accessLevel = 'create_task';
            return data;
        } else if (memberAccessLevel === AccessEnums.ProjectAccessType.VIEW) {
            data.access = {
                manage_dao: false,
                view: true,
                create_task: false,
                manage_project: false,
            };
            data.accessLevel = 'view';
            return data;
        } else {
            return data;
        }
    } catch (err: any) {
        const data: ProjAccessResponse = {
            access: {
                manage_dao: false,
                view: false,
                create_task: false,
                manage_project: false,
            },
            accessLevel: 'hidden',
        };
        return data;
    }
};

export const getRolesForMember = async (memberId: string, daoId: string) => {
    try {
        const roleData = await axios.get(`${process.env.SERVICE_DAO}/role/listbymemberid/${daoId}/${memberId}`);

        let roles: string[] = [];

        if (roleData.data) {
            roles = roleData.data.roles.map((role: any) => role.role_id);
        } else {
            roles = [];
        }

        return roles;
    } catch (err) {
        return [];
    }
};

export const getMemberAccessForDAO = async (memberId: string, daoId: string) => {
    try {
        const accessForMember = await axios.post(`${process.env.SERVICE_DAO}/access/formember`, {
            member_id: memberId,
            dao_id: daoId,
        });

        return accessForMember.data;
    } catch (err) {
        return null;
    }
};

export const getHighestAccess = (AccessLevel: AccessEnums.AccessType[]) => {
    if (AccessLevel.includes(AccessEnums.AccessType.MANAGE_DAO)) {
        return AccessEnums.AccessType.MANAGE_DAO;
    } else if (AccessLevel.includes(AccessEnums.AccessType.MANAGE_PROJECT)) {
        return AccessEnums.AccessType.MANAGE_PROJECT;
    } else if (AccessLevel.includes(AccessEnums.AccessType.VIEW)) {
        return AccessEnums.AccessType.VIEW;
    } else {
        return AccessEnums.AccessType.HIDDEN;
    }
};

export const getAccessLevel = (
    daoAccessLevel: keyof typeof AccessEnums.AccessLevels,
    projectAccessLevel: keyof typeof AccessEnums.AccessLevels
) => {
    if (AccessEnums.AccessLevels[daoAccessLevel] > AccessEnums.AccessLevels[projectAccessLevel]) {
        return daoAccessLevel;
    } else {
        return projectAccessLevel;
    }
};

export const getVisibilityAccessLevel = (
    daoAccessLevel: AccessEnums.AccessType[],
    projectAccessLevel: keyof typeof AccessEnums.AccessLevels,
    projectVisibility: string,
    projectType: string
) => {
    if (projectVisibility === 'public' || projectType === 'internal') {
        if (
            daoAccessLevel.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            AccessEnums.AccessLevels[projectAccessLevel] === 4
        ) {
            return AccessEnums.AccessType.MANAGE_DAO;
        } else if (
            daoAccessLevel.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            AccessEnums.AccessLevels[projectAccessLevel] === 3
        ) {
            return AccessEnums.AccessType.MANAGE_PROJECT;
        } else {
            return AccessEnums.AccessType.HIDDEN;
        }
    } else {
        if (daoAccessLevel.includes(AccessEnums.AccessType.MANAGE_DAO)) {
            return AccessEnums.AccessType.MANAGE_DAO;
        } else if (daoAccessLevel.includes(AccessEnums.AccessType.MANAGE_PROJECT)) {
            return AccessEnums.AccessType.MANAGE_PROJECT;
        } else {
            return projectAccessLevel;
        }
    }
};
