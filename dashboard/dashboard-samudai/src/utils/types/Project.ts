import { ISkill, IUser } from 'utils/types/User';

export interface IProject {
    id: string;
    icon: string;
    title: string;
    start_date: string;
    end_date: string;
    is_complete: boolean;
    department: string;
    visibility: ProjectVisibilty;
    dao_id: string;
    tasks: ITask[];
    manager: IUser;
    created_at: string;
    updated_at: string;
}

export interface ITask {
    id: string;
    project_id: string;
    title: string;
    pos: number;
    status: TaskStatus;
    deadline: string;
    description: string | null;
    bounty: number;
    github: string | null;
    category: string;
    contributors: IUser[];
    labels: ISkill[];
    comments: IComment[];
    attachments: string[];
    created_at: string;
    updated_at: string;
}

export interface ISubtask {
    id: string;
    // ...Not Ready
    created_at: string;
    updated_at: string;
}

export enum ProjectVisibilty {
    PUBLIC = 'public',
    MEMBER = 'member',
}

export enum TaskStatus {
    NOT_STARTED = 'Not Started',
    IN_WORK = 'In Work',
    REVIEW = 'Review',
    DONE = 'Done',
}

type IComment = string; // Comments type
