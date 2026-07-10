import { DiscoveryUser } from 'utils/types/Discovery';
import { mockup_users } from './users';
import { getRandomArrayElement, getRandomInt } from './utils';

export const mockup_discovery: DiscoveryUser[] = Array.from({ length: 12 }).map((_, id) => ({
    id: id.toString(),
    dao_id: '1',
    user: getRandomArrayElement(mockup_users),
    bounty_earned: getRandomInt(500, 30000),
    open_bounties: getRandomInt(0, 100),
    projects_ongoing: getRandomInt(0, 20),
    team_size: getRandomInt(5, 100),
}));
