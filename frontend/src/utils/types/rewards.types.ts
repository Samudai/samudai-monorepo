export interface Reward {
    id: string;
    name?: string;
    start_date?: string;
    end_date?: string;
    date_local?: string;
    start_time?: string;
    end_time?: string | null;
    repeats_every?: number;
    repeat_interval?: RewardInterval | null;
    role: RewardRole;
    repeat_days?: number[];
    message?: string;
    is_cred_lvl: boolean;
    is_coin_holdings: boolean;
    is_discord_role: boolean;
    enable_notifications: boolean;
}

export enum RewardInterval {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
}

export enum RewardRole {
    ADMIN = 'Admin',
    TRIAL_ADMIN = 'Trial admin',
    MODERATOR = 'Moderator',
    USER = 'User',
}

export interface RewardChannel {
    name: string;
    weight: number;
}

export interface RewardEmoji {
    name: string;
    weight: number;
}
