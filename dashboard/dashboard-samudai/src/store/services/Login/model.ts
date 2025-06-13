import { Feedback, MemberResponse } from '@samudai_xyz/gateway-consumer-types';
import { GuildInfo, MemberGuilds } from 'store/features/Onboarding/state';

export interface LoginRequest {
    walletAddress: string;
    chainId: number;
    member: {
        did: string;
        email?: string;
    };
    inviteCode?: string;
    isPrivy?: boolean;
    isXcaster?: boolean;
    privyUserDetails?: any;
}

export interface LoginResponse {
    data?: {
        guildInfo: GuildInfo[];
        memberGuilds: MemberGuilds;
        isOnboarded: boolean;
        onboardingIntegration: any[];
        member_type: 'admin' | 'contributor' | null;
        goTo?: {
            step: number;
            name: string;
        };
        member: MemberResponse;
        jwt: string;
        discord_bot?: string;
    };
    message: string;
    error?: string;
}

export interface githubUserRequest {
    member_id: string;
    code: string;
    redirectUri: string;
}
export interface githubOrgRequest {
    dao_id: string;
    code: string;
    redirectUri: string;
    installation_id: number;
    setup_action: string;
    state: string;
}

export interface discordRequest {
    code: string;
    memberId: string;
    redirectUri: string;
    type_of_member: string;
}

export interface uploadProfilePicRequest {
    file: File | string | null;
    memberId: string;
    typeOfProfilePicture: 0 | 1;
    nftProfileLink: string;
}

export interface onboardingUpdateRequest {
    member: member;
    socials?: social[];
    onBoarding: onboarding;
}

export interface onBoardingUpdateResponse {
    message: string;
    error?: string;
    data?: { member: member; socials: social[]; onBoarding: onboarding };
}
interface social {
    member_id: string;
    type: string;
    url: string;
}

interface member {
    member_id: string;
    username: string;
    did: string;
    open_for_opportunity: boolean;
    captain: boolean;
    profile_picture: string;

    name: string;
    email: string;
    about?: string;
    skills?: string[];
}

interface onboarding {
    member_id: string;
    admin: boolean;
    contributor: boolean;
    type_of_work?: [];
}

export interface getLatestDaoForMemberResponse {
    data: {
        dao: {
            dao_id: string;
        };
    };
    message: string;
}

export interface departmentRequestBulk {
    daoId: string;
    departments: string[];
}
export interface departmentRequest {
    daoId: string;
    department: string;
}

export interface typeOfMemberReq {
    linkId: string;
    stepId: 'TYPE_OF_MEMBER';
    value: {
        user: 'admin' | 'contributor';
    };
}

export interface setUpProfileReq {
    linkId: string;
    stepId: 'SETUP_PROFILE';
}

export interface profileDetailsReq {
    linkId: string;
    stepId: 'PROFILE_DETAILS';
    value: {
        name: string;
        email: string;
        profile_picture: string;
        type_of_member: 'admin' | 'contributor';
        dao_name?: string;
        tags?: string[];
    };
}

export interface AppsSendReq {
    linkId: string;
    stepId: 'INTEGRATIONS';
    value: any;
}

export interface TrialDashboardReq {
    linkId: string;
    stepId: 'TRIAL_DASHBOARD';
}

export interface BotAddedReq {
    linkId: string;
    stepId: 'BOT_ADDED';
}

export interface submitFeedbackReq {
    feedback: Feedback;
}

export interface addNameReq {
    linkId: string;
    stepId: 'ADD_NAME';
    value: {
        name: string;
        profile_picture: string;
        type_of_member: string;
    };
}
