import {
    FavouriteDAOResponse,
    MemberResponse,
    DAOView,
    MostActiveResponse,
    MostViewedResponse,
} from '@samudai_xyz/gateway-consumer-types';

export interface DiscoveryDaoResp {
    message: string;
    error?: any;
    data?: {
        daos: DAOView[];
    };
}
export interface DiscoveryMemberResp {
    message: string;
    error?: any;
    data?: MemberResponse[];
}

export interface FavDAOReq {
    favouriteDAO: {
        dao_id: string;
        member_id: string;
    };
}

export interface FavouriteDaoRes {
    message: string;
    error?: any;
    data?: { favourite_list: FavouriteDAOResponse[] };
}

export interface getMostActiveResponse {
    message: string;
    error?: any;
    data?: MostActiveResponse;
}

export interface getMostViewedResponse {
    message: string;
    error?: any;
    data?: MostViewedResponse;
}

export interface DiscoveryViewRequest {
    newView: {
        type: 'dao' | 'contributor';
        link_id: string;
    };
}

export interface getAllSkillsResponse {
    message: string;
    error?: any;
    data?: {
        skills: string[];
    };
}

export interface getAllDomainTagsResponse {
    message: string;
    error?: any;
    data?: {
        domainTags: string[];
    };
}

export interface getAllTagsResponse {
    message: string;
    error?: any;
    data?: {
        tags: string[];
    };
}

export interface DiscoveryTags {
    mostViewedDAO: DAOView[];
    mostActiveDAO: DAOView[];
    mostViewedContributor: MemberResponse[];
    mostActiveContributor: MemberResponse[];
}

export interface getDiscoveryTagsResponse {
    message: string;
    error?: any;
    data?: DiscoveryTags;
}

export interface getBulkDiscoveryDaoRequest {
    daoIds: string[];
    memberId: string;
}

export interface getBulkDiscoveryDaoResponse {
    message: string;
    error?: any;
    data?: {
        data: DAOView[];
    };
}

export interface getBulkDiscoveryMemberRequest {
    memberIds: string[];
    memberId: string;
}

export interface getBulkDiscoveryMemberResponse {
    message: string;
    error?: any;
    data?: {
        data: MemberResponse[];
    };
}
