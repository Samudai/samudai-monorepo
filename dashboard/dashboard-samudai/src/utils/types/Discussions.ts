import { IUser } from './User';

export interface IDiscussion {
    id: string;
    topic: string;
    description: string;
    participants: IUser[];
    author: IUser;
    type: DiscussionType;
    created_at: string;
}

export enum DiscussionType {
    Project = 'Project',
    Proposal = 'Proposal',
    Community = 'Community',
}
