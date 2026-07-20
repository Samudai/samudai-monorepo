import { IUser } from './User';

export interface DiscoveryUser {
    id: string;
    user: IUser;
    dao_id: string;
    team_size: number;
    open_bounties: number;
    projects_ongoing: number;
    bounty_earned: number;
    tasks_ongoing?: number;
}
