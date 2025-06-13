import { OpportunityOpenTo } from '@samudai_xyz/gateway-consumer-types/dist/types/jobs/enums';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import dayjs, { Dayjs } from 'dayjs';
import { ISkill } from 'utils/types/User';

export interface IQuestion {
    id: string;
    question: string;
}

export type IJobTask = {
    id: string;
    title: string;
    description: string;
    skills: ISkill[];
};

export interface CreateJobData {
    title: string;
    description: string;
    department: {
        id: string;
        name: string;
    };
    captain: boolean;
    payoutAmount: number;
    payoutCurrency: string;
    winners: number;
    minPeople: number;
    startDate: Dayjs;
    endDate: Dayjs;
    github: string;
    contacts: IMember;
    attachments: File[];
    openTo: OpportunityOpenTo[];
    skills: string[];
    tags: string[];
    tasks: IJobTask[];
    questions: IQuestion[];
    associatedTo: string;
}

export function getDefaultCreateData(): CreateJobData {
    return {
        title: '',
        description: '',
        department: {
            id: '',
            name: '',
        },
        captain: false,
        payoutAmount: 0,
        payoutCurrency: 'USDT',
        minPeople: 1,
        startDate: dayjs(),
        endDate: dayjs().add(1, 'd'),
        github: '',
        contacts: {
            member_id: '',
            username: '',
            profile_picture: '',
            name: '',
        },
        attachments: [],
        openTo: [],
        skills: [],
        tags: [],
        questions: [],
        tasks: [],
        winners: 0,
        associatedTo: '',
    };
}
