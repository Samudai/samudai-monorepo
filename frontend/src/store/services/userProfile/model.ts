import {
    FeaturedProjects,
    Member,
    MemberResponse,
    ProjectEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { NewContributorItems } from '@samudai_xyz/gateway-consumer-types/dist/types/activity/enums';
import { discordData } from 'store/features/Onboarding/state';

export interface getMemberByIdResponse {
    message: string;
    data?: {
        member: MemberResponse;
        socials: {
            member_id: string;
            type: string;
            url: string;
        }[];
    };
    error?: string;
}

export interface updateMemberReq {
    member: {
        member_id: string;
        username: string;
        did: string;
        open_for_opportunity: boolean;
        captain: boolean;
        name?: string;
        email?: string;
        about?: string;
        skills: string[];
        profile_picture?: string;
        ceramic_stream?: string;
    };
    socials: {
        member_id: string;
        type: string;
        url: string;
    }[];
}
export interface member {
    member_id: string;
    username: string;
    did: string;
    open_for_opportunity: boolean;
    captain: boolean;
    subdomain: null | string;
    name: string;
    email: string;
    phone?: string | null;
    about?: string;
    skills?: string[];
    profile_picture?: string | null;
    discord: {
        discord_user_id: string;
        username: string;
        avatar: string;
        locale: string;
        discriminator: string;
        email: string;
        verified: boolean;
    };
    wallets: {
        wallet_id: number;
        wallet_address: string;
        chain_id: number;
        chain: string;
        default: boolean;
        network: string;
        currency: string;
        type: string;
    }[];
    created_at: string;
    updated_at: string;
    ceramic_stream: string | null;
}

export interface createClanRequest {
    clan: clan;
}

export interface clan {
    name: string;
    visibility: ProjectEnums.Visibility;
    avatar: string;
    created_by: string;
}

export interface addMemberRequest {
    clanMember: {
        clan_id: string;
        member_id: string;
        role: string;
    };
}

export interface createClanResponse {
    message: string;
    data?: {
        clan_id: string;
    };
    error?: string;
}

export interface addMemberResponse {
    error?: any;
    message: string;
    data?: {
        message: string;
    };
}

export interface getClanByMemberIdResponse {
    message: string;
    data?: clans[];
    error?: string;
}

interface clans {
    clan_id: string;
    name: string;
    visibility: string;
    avatar: string;
    created_by: string;
    members: {
        member_id: string;
        role: string;
        notification: boolean;
    }[];

    created_at: string;
    updated_at: string | null;
}

export interface getClanByMemberIdRequest {
    member: {
        type: string;
        value: string;
    };
}

export interface createConnectionReq {
    connection: {
        sender_id: string;
        receiver_id: string;
        status: 'pending';
    };
}

export interface searchMemberRes {
    message: string;
    data?: Member[];
    error?: string;
}

export interface updateConnectionReq {
    connection: {
        id?: string;
        sender_id: string;
        receiver_id: string;
        status: string;
    };
}

export interface updateHourlyRate {
    member_id: string;
    currency: string;
    hourly_rate: string;
}

export interface updateOpenForOpportunity {
    member_id: string;
    open_for_opportunity: boolean;
}

export interface getConnectionsById {
    message: string;
    data?: {
        connections: MemberResponse[];
    };
    error?: string;
}

export interface updateFeaturedProjectsRequest {
    member_id: string;
    featured_projects: FeaturedProjects[];
}

export interface MemberWorkProgress {
    overdue_tasks_count: number;
    ongoing_tasks_count: number;
    total_tasks_taken: number;
    pending_admin_reviews: number;
    dao_worked_with: any[];
}

export interface getMemberWorkProgress {
    message: string;
    data?: {
        member_work_progress: MemberWorkProgress;
    };
    error?: string;
}

export interface getContributorProgressResponse {
    message: string;
    data?: {
        items: {
            [key in NewContributorItems]: boolean;
        };
    };
    error?: string;
}

export interface claimNFTResponse {
    message: string;
    data?: {
        message: string;
    };
    error?: string;
}

export interface getDiscordGuilds {
    message: string;
    data?: discordData;
    error?: string;
}

export interface getCID {
    message: string;
    data: {
        cid: string;
    };
}

export interface checkSubdomainAccessResponse {
    message: string;
    data?: { access: boolean };
    error?: string;
}
