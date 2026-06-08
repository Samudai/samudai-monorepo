import { Reward, RewardInterval, RewardRole } from 'utils/types/rewards.types';

type RewardPopulateData = {
    role: RewardRole;
    items: Reward[];
};

export const initRewards: RewardPopulateData[] = [
    {
        role: RewardRole.ADMIN,
        items: [
            {
                enable_notifications: true,
                end_date: '2023-02-13T15:27:12.600Z',
                start_date: '2023-01-13T15:27:12.600Z',
                id: '1ci29312u0n9c3u1c2n',
                is_coin_holdings: true,
                is_cred_lvl: true,
                is_discord_role: true,
                date_local: '(India Standard Time)',
                message: 'Lorem ipsum sit dolor.',
                name: 'Samudai main reward',
                repeat_days: [1, 3, 5],
                repeat_interval: RewardInterval.WEEK,
                repeats_every: 2,
                role: RewardRole.ADMIN,
                start_time: '2023-01-13T15:27:12.600Z',
                end_time: '2023-02-13T11:00:12.600Z',
            },
            {
                enable_notifications: true,
                end_date: '2023-02-13T15:27:12.600Z',
                start_date: '2023-01-13T15:27:12.600Z',
                id: '12v3v12',
                is_coin_holdings: true,
                is_cred_lvl: true,
                is_discord_role: true,
                date_local: '(India Standard Time)',
                message: 'Lorem ipsum sit dolor.',
                name: 'Samudai secondary reward',
                repeat_days: [1, 3, 5],
                repeat_interval: RewardInterval.WEEK,
                repeats_every: 2,
                role: RewardRole.ADMIN,
                start_time: '2023-01-13T15:27:12.600Z',
                end_time: '2023-02-13T11:00:12.600Z',
            },
        ],
    },
    {
        role: RewardRole.TRIAL_ADMIN,
        items: [
            {
                enable_notifications: true,
                end_date: '2023-02-13T15:27:12.600Z',
                start_date: '2023-01-13T15:27:12.600Z',
                id: '1ci29312u0n9c3u1c2n',
                is_coin_holdings: true,
                is_cred_lvl: true,
                is_discord_role: true,
                date_local: '(India Standard Time)',
                message: 'Lorem ipsum sit dolor.',
                name: 'Test reward',
                repeat_days: [1, 3, 5],
                repeat_interval: RewardInterval.WEEK,
                repeats_every: 2,
                role: RewardRole.TRIAL_ADMIN,
                start_time: '2023-01-13T15:27:12.600Z',
                end_time: '2023-02-13T11:00:12.600Z',
            },
        ],
    },
];
