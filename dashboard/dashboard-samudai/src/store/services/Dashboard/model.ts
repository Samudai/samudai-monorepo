import {
    Activity,
    Dashboard,
    FormEnums,
    IMember,
    Provider,
    ReviewResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { IWidget } from 'utils/types/DAO';

export interface getDefaultProviderRequest {
    message: string;
    data?: Provider;
    error?: any;
}
export interface defaultProviderData {
    id: string;
    dao_id: string;
    provider_type: string;
    address: string;
    created_by: string;
    created_at: string;
    updated_at: null | string;
    chain_id: number;
    is_default: boolean;
    name: string;
}

export interface getBlogResponse {
    message: string;
    error: any;
    data: blogData[];
}

export interface blogData {
    id: string;
    dao_id: string;
    link: string;
    created_at: string;
    metadata: {
        ogTitle: string;
        ogDescription: string;
        ogImage: {
            url: string;
        };
    };
}

export interface addReviewRequest {
    review: {
        dao_id: string;
        member_id: string;
        content: string;
        rating: number;
    };
}

export interface dashboardIdResponse {
    message: string;
    error?: any;
    data?: {
        dashboards: {
            dashboard_id: string;
            dao_id: string;
            dashboard_name: string;
            description: string;
            default: boolean;
            visibility: string;
            widgets: IWidget[];
            created_at: string;
            updated_at: string;
        }[];
    };
}

export interface activityResponse {
    message: string;
    data: Activity[];
}

export interface updateDashBoardRequest {
    dashboardId: string;
    widgets: IWidget[];
}

export interface createDashboardRequest {
    dashboard: Dashboard;
}

export interface updateDashboardNameRequest {
    dashboard: { dashboard_id: string; dashboard_name: string };
}

export interface getTweetsRes {
    message: string;
    error: any;
    data: tweet[];
}

export interface tweet {
    id: string;
    name: string;
    img: string;
    text: string;
    links: string[];
    date: string;
    verified: boolean;
    comments: number;
    shared: number;
    likes: number;
}

export interface createFormReq {
    form: {
        dao_id: string;
        type: FormEnums.FormType;
        name: string;
        questions: {
            question: string;
            type: FormEnums.QuestionType;
            select: string[];
            required: boolean;
            description: string;
        }[];
        created_by: string;
    };
}
export interface updateFormReq {
    form: {
        dao_id: string;
        form_id: string;
        type: FormEnums.FormType;
        questions: {
            question: string;
            type: FormEnums.QuestionType;
            select: string[];
        }[];
        updated_by: string;
    };
}

export interface getFormsRes {
    message: string;
    error?: any;
    data?: form[];
}

export interface getFormRes {
    message: string;
    error?: any;
    data?: {
        form: form;
    };
}

export interface form {
    dao_id: string;
    form_id: string;
    type: FormEnums.FormType;
    name: string;
    created_by: IMember;
    updated_by: IMember | null;
    created_at: string;
    updated_at: string | null;
    questions: {
        id: number;
        question: string;
        type: FormEnums.QuestionType;
        select: string[];
        description: string;
        required: boolean;
    }[];
}
export interface addUserReviewReq {
    review: {
        member_id: string;
        reviewer_id: string;
        content: string;
        rating: number;
        dao_id: string;
    };
}

export interface DiscordEventsRes {
    message: string;
    error?: any;
    data: DiscordEvent[];
}

export interface DiscordEvent {
    entity_metadata: {
        location?: string;
    };
    id: string;
    guild_id: string;
    channel_id: string;
    creator_id: string;
    name: string;
    description: string;
    scheduled_start_timestamp: string;
    scheduled_end_timestamp: string;
    user_count: number;
    image: string;
    users: {
        id: string;
        bot: boolean;
        username: string;
        discriminator: string;
        avatar: string;
        created_at: string;
    }[];
}

export interface updateDaosocialsReq {
    daoSocial: {
        dao_id: string;
        type: string;
        url: string;
    }[];
}

export interface getReviewResponse {
    message: string;
    error?: any;
    data?: ReviewResponse[];
}
