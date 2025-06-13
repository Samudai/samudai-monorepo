import {
    AccessEnums,
    GithubPR,
    Payout,
    Project,
    ProjectColumn,
    ProjectEnums,
    ProjectFile,
    ProjectResponse,
    SubTask,
    SubTaskResponse,
    Task,
    TaskResponse,
    Token,
} from '@samudai_xyz/gateway-consumer-types';
import { IMember as ProjectIMember } from '@samudai_xyz/gateway-consumer-types';

export interface getTokenRes {
    message: string;
    data: {
        tokens: Token[];
    };
    error?: any;
}
export interface updatePayout {
    task_id: string;
    payout: Payout[];
    updated_by: string;
}
export interface getCurrencyResp {
    message: string;
    data?: {
        name: string;
        symbol: string;
    };
    error?: any;
}
export interface IMember {
    member_id: string;
    username: string;
    profile_picture: string;
    name?: string;
}
export interface addProjectsByMemberResponse {
    data: Project;
    message: string;
    error?: string;
}

export interface getProjectByMemberIdResponse {
    data: ProjectResponse[];
    message: string;
    error?: string;
}

export interface addColumnRequest {
    projectId: string;
    columns: ProjectColumn[];
    updatedBy: string;
    totalCol: number;
}

export interface getProjectByMemberIdQRequest {
    member_id: string;
    daos: dao[];
}

interface dao {
    dao_id: string;
    roles: string[];
}

export interface getProjectByIdResponse {
    data: {
        project: ProjectResponse;
        projectAccess: null | string;
    };
    message: string;
    error?: string;
}

export interface getProjectByLinkResponse {
    message: string;
    data?: { projects: ProjectResponse[] };
    error?: any;
}

export interface getTasksFormByProjectIdResponse {
    data?: Task[];
    contributors?: IMember[];
    message: string;
    error?: string;
}

export interface getTasksByProjectIdResponse {
    data?: TaskResponse[];
    contributors?: IMember[];
    message: string;
    error?: string;
}
export interface getTaskByTaskIdResponse {
    data?: TaskResponse;
    message: string;
    error?: string;
}

export interface getSubTaskByIdResponse {
    data?: SubTaskResponse;
    message: string;
    error?: string;
}

export interface createTaskRequest {
    task: {
        project_id: string;
        title: string;
        description?: string;
        col: number;
        created_by: string;
        position?: number;
        poc_member_id: string;
        deadline?: string;
        assignee_member?: string[];
        assignees?: ProjectIMember[];
        github_issue?: any;
        github_pr?: GithubPR;
        tags?: string[];
        payout?: {
            payout_amount: number;
            payout_currency: string;
            safe_address: string;
            token_address?: string | undefined;
        }[];
    };
}

export interface updateColumnsRequest {
    task_id: string;
    col: number;
    totalcol: number;
    updated_by: string;
}

export interface updateInvestmentColumnsRequest {
    response_id: string;
    col: number;
    updated_by: string;
}

export interface updateColumnHeadsRequest {
    projectId: string;
    columns: ProjectColumn[];
    updatedBy: string;
    totalCol: number;
}

export interface updatePinnedRequest {
    projectId: string;
    linkId: string;
    pinned: boolean;
    updatedBy: string;
}

export interface updatePositionRequest {
    task_id: string;
    position: number;
    updated_by: string;
    project_id: string;
}

export interface updateInvestmentPositionRequest {
    taskResponsePosition: {
        response_id: string;
        position: number;
        updated_by: string;
        project_id: string;
    };
}

export interface importNotionRequest {
    member_id: string;
    database_id: string;
    dao_id: string;
    department: string;
    notion_property: string;
    property: { field: string; value: string }[];
}
export interface createTaskResponse {
    message: string;
    data?: {
        task_id: string;
    };
    error?: string;
}

export interface addCommentRequest {
    comment: {
        link_id: string;
        body: string;
        author: string;
        type: 'task' | 'project';
    };
}

export interface getNotionDatabaseResponse {
    data?: {
        id: string;
        name: string;
    }[];
    message: string;
    error?: string;
}

export interface IGetNotionProperties {
    message: string;
    data?: NotionProperty[];
    error?: string;
}

export interface NotionProperty {
    id: string;
    type: string;
    name: string;
    select?: {
        options: {
            id: string;
            name: string;
            color: string;
        }[];
    };
}

export interface getDepartmentByDaoIdResponse {
    message: string;
    data?: {
        department_id: string;
        dao_id: string;
        name: string;
        created_at: string;
    }[];
    error?: string;
}

export interface personalTaskResponse {
    data?: {
        tasks: TaskResponse[];
    };
    message: string;
    error?: string;
}

export interface getAccessResponse {
    message: string;
    data?: {
        id: string;
        dao_id: string;
        access: AccessEnums.AccessType;
        members: IMember[];
        roles: string[];
        created_at: string;
        updated_at: string;
        invite_link: string;
    }[];
    error?: string;
}

export interface updateProjectAccessRequest {
    projectId: string;
    visibility: ProjectEnums.Visibility;
    updatedBy: string;
    projectAccess: {
        project_id: string;
        access: AccessEnums.AccessType;
        members: string[];
        roles: string[];
    }[];
}

export interface gitHubReposRes {
    message: string;
    data?: {
        repos: string[];
    };
    error?: string;
}

export interface updateProjectReq {
    project: Project;
}

export interface createFolderReq {
    fileFolder: {
        project_id: string;
        name: string;
        created_by: string;
        description: string;
        folder_id: string;
    };
}

export interface createFileRq {
    projectFile: {
        folder_id: string;
        name: string;
        url: string;
    };
}

export interface createFolderRes {
    message: string;
    data?: {
        folder_id: string;
    };
    error?: any;
}

export interface folderRes {
    folder_id: string;
    project_id: string;
    name: string;
    description?: string;
    created_by?: string;
    updated_by?: string;
    created_at?: string;
    updated_at?: string;
    files?: ProjectFile[];
}
export interface getFolderByFIdRes {
    message: string;
    data?: folderRes;
    error?: any;
}
export interface getFolderByPIdRes {
    message: string;
    data?: folderRes[];
    error?: any;
}
export interface tokenCreate {
    token: {
        dao_id: string;
        ticker: string;
        contract_address: string;
        average_time_held: string;
        holders: number;
    };
}
export interface taskUpdateReq {
    task: {
        task_id: string;
        project_id: string;
        title: string;
        description: string;
        created_by: string;
        position?: number;
        updated_by: string;
        poc_member_id?: string;
        github_issue?: number;
        tags: string[];
        deadline?: string;
        assignee_member: string[];
        assignee_clan?: string[];
        feedback?: string;
        notion_page?: string;
        notion_property?: string;
        github_pr?: GithubPR;
    };
}

export interface createSubTaskReq {
    subtask: {
        title: string;
        completed: boolean;
        task_id: string;
    };
}

export interface updateSubTaskReq {
    subtaskId: string;
    completed: boolean;
}

export interface assignTask {
    taskAssign: {
        type: 'member' | 'clan';
        task_id: string;
        project_id: string;
        assignee_member: string[];
        assignee_clan: string[];
        updated_by: string;
    };
}

export interface bulkTaskPositionUpdateRequest {
    tasks: {
        updated_by: string;
        task_id: string;
        col: number;
    }[];
}

export interface bulkSubTaskPositionUpdateRequest {
    subtasks: {
        updated_by: string;
        subtask_id: string;
        col: number;
    }[];
}

export interface bulkResponsePositionUpdateRequest {
    taskFormResponses: {
        updated_by: string;
        response_id: string;
        col: number;
    }[];
}

export interface getTaskFormResponse {
    message: string;
    data?: {
        responses: {
            response_id: string;
            project_id: string;
            response_type: string;
            mongo_object: string;
            title: string;
            col: number;
            position: number;
            discussion_id?: string;
            updated_by?: string;
            created_at: string;
            updated_at?: string;
        }[];
    };
    error?: any;
}

export interface getSubTasksByProjectIdResponse {
    message: string;
    data?: {
        subtasks: SubTask[];
        total: number;
    };
    error?: string;
}

export interface createSubTaskRequest {
    subtask: {
        project_id: string;
        title: string;
        task_id: string;
        col: number;
        created_by: string;
        poc_member_id: string;
        position: number;
    };
}

export interface updateSubTaskRequest {
    subtask: SubTask;
}

export interface updateSubTaskColumnRequest {
    subtaskId: string;
    col: number;
    updated_by: string;
}

export interface updateSubTaskRowRequest {
    subtaskId: string;
    position: number;
    updated_by: string;
}

export interface IPayoutRequest extends Omit<Payout, 'payout_id' | 'payout_amount'> {
    payout_id?: string;
    payout_amount: string | number;
}
