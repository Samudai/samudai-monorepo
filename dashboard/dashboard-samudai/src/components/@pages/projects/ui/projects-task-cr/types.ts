import { IMember } from 'utils/types/User';

export interface ISubtask {
    title: string;
    members: IMember[];
}

export interface ITemporaryComment {
    id: string;
    text: string;
    created_by: IMember;
    createdAt: string;
}
