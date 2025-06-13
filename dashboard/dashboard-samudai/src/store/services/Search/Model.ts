import { DAO, MemberResponse, ProjectEnums } from '@samudai_xyz/gateway-consumer-types';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

export interface searchMemberRes {
    message: string;
    data?: MemberResponse[];
    error?: string;
}

export interface searchDAOReq {
    message: string;
    data?: DAO[];
    error?: string;
}

export interface searchRes {
    message: string;
    error?: any;
    data?: searchVal[];
}

export interface projectReasrchRes {
    message: string;
    error?: any;
    data?: projectSearch[];
}

export interface projectSearch {
    project_id: string;
    link_id: string;
    type: string;
    project_type: string;
    title: string;
    description: string;
    visibility: ProjectEnums.Visibility;
    start_date: string;
    end_date: string;
    created_by: string;
    updated_by: string;
    department: string;
    columns: number;
    total_col: number;
    completed: boolean;
    pinned: boolean;
    contributors: string[];
    created_at: string;
    updated_at: string;
}

export interface searchVal {
    type: string;
    name: string;
    id: string;
    profile_picture: string;
    username: string;
}

export interface searchMemberforDao {
    message: string;
    data?: IMember[];
    error?: string;
}

// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
//   name: string;
// }
