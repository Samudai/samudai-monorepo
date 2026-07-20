import { IMember } from 'utils/types/User';

export enum BoardGroupByEnum {
    STATUS = 'By Status',
    DEPARTMENT = 'By Department',
    CONTRIBUTOR = 'By Contributor',
}

export interface ITemporaryTaskItem {
    task_id: string;
    departments: {
        value: string | number;
        label: string;
    }[];
    title: string;
    created_by: IMember;
    status: string;
    subtasks?: any;
    comments?: any;
    position: number;
}

export interface ITemporarySubtaskItem {
    subtask_id: string;
    title: string;
    created_by: IMember;
    status: string;
    comments: number;
    position: number;
}

export type ProjectOption = 'payout' | 'create-job' | null;
