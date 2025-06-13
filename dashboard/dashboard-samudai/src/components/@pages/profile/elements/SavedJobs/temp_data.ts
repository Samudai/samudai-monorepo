import { ISkill } from 'utils/types/User';

export const data: TempJobData[] = [
    {
        id: 0,
        name: 'Product Designer',
        skills: [
            { id: 0, name: 'Product Design', icon: '/img/skills/product.svg' },
            { id: 3, name: 'User Flow', icon: '/img/skills/user_flow.svg' },
        ],
        bounty: 12000,
        experience: 2,
        type: 'remote',
    },
    {
        id: 1,
        name: 'Product Designer',
        skills: [
            { id: 0, name: 'Product Design', icon: '/img/skills/product.svg' },
            { id: 2, name: 'UI Design', icon: '/img/skills/ui.svg' },
            { id: 3, name: 'User Flow', icon: '/img/skills/user_flow.svg' },
        ],
        bounty: 15000,
        experience: 2,
        type: 'remote',
    },
];

export type TempJobData = {
    id: number;
    name: string;
    skills: ISkill[];
    bounty: number;
    experience: number;
    type: 'remote';
};
