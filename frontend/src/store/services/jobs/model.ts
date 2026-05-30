import {
    Applicant,
    Bounty,
    BountyResponse,
    JobPayout,
    Opportunity,
    OpportunityResponse,
    Submission,
} from '@samudai_xyz/gateway-consumer-types';
import { JobsEnums } from '@samudai_xyz/gateway-consumer-types';

export interface getOpportunityByIdResponse {
    data: {
        opportunity: OpportunityResponse;
    };
    message: string;
}

export interface getBountyByIdResponse {
    data: {
        bounty: BountyResponse;
    };
    message: string;
}

export interface JobPayoutRequest
    extends Omit<JobPayout, 'payout_id' | 'name' | 'link_type' | 'link_id' | 'rank'> {
    payout_id?: string;
    name?: string;
    link_type?: string;
    link_id?: string;
    rank?: number;
}

export interface OpportunityRequest
    extends Omit<Opportunity, 'job_id' | 'payout' | 'transaction_count'> {
    job_id?: string;
    payout: JobPayoutRequest[];
}

export interface createOpportunityRequest {
    opportunity: OpportunityRequest;
}

export interface BountyRequest extends Omit<Bounty, 'bounty_id' | 'payout'> {
    bounty_id?: string;
    payout: JobPayoutRequest[];
}

export interface createBountyRequest {
    bounty: BountyRequest;
}

export interface ApplicantRequest {
    job_id: string;
    member_id: string;
    application: string;
    status: JobsEnums.ApplicantStatusType;
}

export interface createApplicantRequest {
    applicant: ApplicantRequest;
    type: JobsEnums.ApplicantType;
}

export interface createSubmissionRequest {
    submission: {
        bounty_id: string;
        member_id: string;
        submission: string;
        file: string;
        status: JobsEnums.ApplicantStatusType;
    };
    type: JobsEnums.ApplicantType;
}

export interface getOpportunityByDaoIdResponse {
    data: {
        opportunities: OpportunityResponse[];
    };
    message: string;
}

export interface getBountiesByDaoIdResponse {
    data: {
        bounty: BountyResponse[];
    };
    message: string;
}

export interface getBountyByDaoIdResponse {
    data: {
        bounty: BountyResponse[];
    };
    message: string;
}

export interface getSkillsForJob {
    data: {
        skills: string[];
    };
    message: string;
}

export interface getApplicantsByIdResponse {
    message: string;
    data: {
        applicants: {
            members: Applicant[];
        };
    };
}

export interface getApplicantsByMemberIdResponse {
    message: string;
    data: {
        applicants: Applicant[];
    };
}

export interface getSubmissionsByIdResponse {
    message: string;
    data: {
        submissions: {
            clans: Submission[];
        };
    };
}

export interface getSubmissionsByMemberIdResponse {
    message: string;
    data: {
        submissions: Submission[];
    };
}

export interface updateOpportunityStatusRequest {
    jobId: string;
    status: JobsEnums.JobStatus;
    updatedBy: string;
}

export interface updateBountyStatusRequest {
    bountyId: string;
    status: JobsEnums.JobStatus;
    updatedBy: string;
}

export interface updateApplicantStatusRequest {
    jobAssociatedTaskId: string;
    jobAssociatedProjectId: string;
    applicant: {
        job_id: string;
        member_id: string;
        applicant_id: string;
        status: JobsEnums.ApplicantStatusType;
        updated_by: string;
    };
    type: string;
}

export interface reviewSubmissionRequest {
    submission: {
        submission_id: string;
        member_id: string;
        bounty_id: string;
        status: JobsEnums.ApplicantStatusType;
        updated_by: string;
        feedback?: string;
        rank?: number;
    };
}

export interface favouriteOpportunityRequest {
    favourite: {
        member_id: string;
        job_id: string;
    };
}

export interface favouriteBountyRequest {
    favourite: {
        member_id: string;
        bounty_id: string;
    };
}

export interface getFavouriteOpportunities {
    message: string;
    data?: {
        favourite_list: OpportunityResponse[];
    };
}

export interface getFavouriteBounties {
    message: string;
    data?: {
        favourite_list: BountyResponse[];
    };
}

export interface totalApplicantAndAppliedCountRequest {
    memberId: string;
    daoIds: string[];
}

export interface totalApplicantAndAppliedCountResponse {
    message: string;
    data?: {
        appliedJobCount: number;
        applicantCount: number;
    };
}
