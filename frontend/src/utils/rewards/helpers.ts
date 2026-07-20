import { Reward } from '../types/rewards.types';
import { v4 as uuidv4 } from 'uuid';
import { RewardInterval, RewardRole } from 'utils/types/rewards.types';

type GroupByRole = {
    role: Reward['role'];
    items: Reward[];
};

export const groupByRoles = (data: Reward[]) => {
    const roles: GroupByRole[] = [];
    for (const item of data) {
        const role = roles.find((role) => role.role === item.role);
        if (role) {
            role.items.push(item);
            continue;
        }
        roles.push({ role: item.role, items: [item] });
    }
    return roles;
};

export const getRewardFormData = (role: RewardRole) => {
    return {
        id: uuidv4(),
        date_local: null,
        role,
        enable_notifications: false,
        enable_time: false,
        is_coin_holdings: false,
        is_cred_lvl: false,
        is_discord_role: false,
        message: '',
        end_date: null,
        start_date: null,
        end_time: null,
        start_time: null,
        name: '',
        repeat_days: [],
        repeat_every: 0,
        repeat_interval: null,
        min_token: '',
        coin_address: '',
        cred_filter: null,
        members: 0,
    } as {
        id: string;
        date_local: null | string;
        role: RewardRole;
        enable_notifications: boolean;
        enable_time: boolean;
        is_coin_holdings: boolean;
        is_cred_lvl: boolean;
        is_discord_role: boolean;
        message: string;
        start_date: string | null;
        end_date: string | null;
        start_time: string | null;
        end_time: string | null;
        name: string;
        repeat_days: number[];
        repeat_every: number;
        repeat_interval: RewardInterval | null;
        min_token: string;
        coin_address: string;
        cred_filter: number | null;
        members: number;
    };
};

export const extractFormDataDropFields = (data: ReturnType<typeof getRewardFormData>) => {
    return {
        name: data.name,
        is_cred_lvl: data.is_cred_lvl,
        is_discord_role: data.is_discord_role,
        is_coin_holdings: data.is_coin_holdings,
        cred_filter: data.cred_filter,
        members: data.members,
        coin_address: data.coin_address,
        min_token: data.min_token,
        role: data.role,
    };
};

export const getRewardsRepeatDays = () => {
    return [
        { name: 'Mo', day: 1 },
        { name: 'Tu', day: 2 },
        { name: 'We', day: 3 },
        { name: 'Th', day: 4 },
        { name: 'Fr', day: 5 },
        { name: 'Sa', day: 6 },
        { name: 'Su', day: 0 },
    ];
};
