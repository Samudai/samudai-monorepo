import { IMember } from '../../UI/UserInfo/ConnectionUserInfo';
import '@samudai_xyz/gateway-consumer-types';
import { OpportunityOpenTo } from '@samudai_xyz/gateway-consumer-types/dist/types/jobs/enums';
import { Visibility } from '@samudai_xyz/gateway-consumer-types/dist/types/project/enums';
import { IUser } from 'utils/types/User';
import { JobFile, BountyFile } from '@samudai_xyz/gateway-consumer-types';

export interface IOpportunity {
    job_id: string;
    dao_id?: string;
    type: JobType;
    title: string;
    description: string;
    created_by: IUser;
    visibility: JobVisibility;
    status: JobStatus;
    req_people_count: number;
    start_date: string;
    end_date: string;
    project_id?: string;
    task_id?: string;
    github?: string;
    poc_member_id?: string;
    questions: JobQuestion[];
    captain: boolean;
    skills: string[];
    tags: string[];
    updated_at?: string;
    created_at?: string;
    payout_amount: number;
    payout_currency: string;
    // New
    experience?: number; // Month count
    open_to?: JobRole[];
    job_format?: JobFormat;
}

interface Questions {
    [key: number]: string;
}

export interface OpportunityResponse {
    job_id: string;
    dao_id: string;
    type: JobType;
    title: string;
    description: string;
    created_by: IMember;
    visibility: Visibility;
    status: JobStatus;
    req_people_count: number;
    start_date?: string;
    end_date?: string;
    project_id?: string;
    task_id?: string;
    github?: string;
    poc_member_id?: IMember;
    questions?: string[];
    captain: boolean;
    department?: string;
    skills: string[];
    tags: string[];
    created_at?: string;
    updated_at?: string;
    payout_amount: number;
    payout_currency: string;
    files?: JobFile[] | BountyFile[];

    experience: number;
    open_to: OpportunityOpenTo[];
    job_format: JobFormat;
}

export interface JobQuestion {
    id: string;
    title: string;
}

export enum JobFormat {
    FULL_TIME = 'Full Time',
    REMOTE = 'Remote',
    FREELANCE = 'Freelance',
}

export enum JobStatus {
    OPEN = 'open',
    CLOSED = 'closed',
    DRAFT = 'draft',
}

export enum JobType {
    PROJECT = 'project',
    TASK = 'task',
    BOUNTY = 'bounty',
}

export enum JobVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum JobRole {
    DAOs = 'DAOs',
    DAO_MEMBERS = 'DAO Members',
    CAPTAINS = 'Captains',
    CONTRIBUTORS = 'Contributors',
}

export interface JobFilter {
    all: boolean;
    role: string[];
    bounty: {
        min: number;
        max: number;
    };
}
