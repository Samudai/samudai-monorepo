export interface firstTimeCheckoutRequest {
    daoId: string;
    memberId: string;
    billing: 'monthly' | 'yearly';
    customerEmail: string;
    priceTier: 'small' | 'medium' | 'enterprise';
}

export interface subscriptionResponse {
    message: string;
    data?: {
        url: string;
    };
}

export interface usedLimitCount {
    userCount: number;
    projectCount: number;
    formCount: number;
    discussionCount: number;
}

export interface getUsedLimitCountResponse {
    message: string;
    data?: usedLimitCount;
}

export interface cancellationFeedbackRequest {
    feedback: {
        member_id: string;
        dao_id: string;
        feedback: string;
        subscriptionQty: number;
        alternative?: string;
    };
}

export interface newMemberData {
    member_id: string;
    username: string;
    profile_picture?: string;
    name?: string;
    licensed_member: boolean;
}

export interface getMembersForDaoResponse {
    message: string;
    data?: newMemberData[];
}

export interface bulkLicenseUpdateRequest {
    daoId: string;
    memberIds: string[];
    licensedMember: boolean;
}
