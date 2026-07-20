import { JobFormat } from '../utils/types/Jobs';
import dayjs from 'dayjs';
import { JobRole, JobStatus, JobType, JobVisibility, IOpportunity } from 'utils/types/Jobs';
import { mockup_users } from 'root/mockup/users';
import { getRandomArrayElement, getRandomArrayLength, getRandomInt } from './utils';
import { v4 as uuidv4 } from 'uuid';

export const mockup_jobs: IOpportunity[] = Array.from({ length: 30 }).map((_, id) => ({
    dao_id: '',
    job_id: (id + 1).toString(),
    type: getRandomArrayElement(Object.values(JobType)),
    title: getRandomArrayElement([
        'Product Designer',
        'Front-End Dev',
        'Back-End Dev',
        'Scientist',
        'Animator',
    ]),
    description:
        'I live in any area that drives experience — whether it’s initial exploration, critically refining user flows and functionality, or polishing the visuals. I help businesses develop their product and iterate quickly to deliver meaningful, successful results.',

    visibility: getRandomArrayElement(Object.values(JobVisibility)),
    status: getRandomArrayElement(Object.values(JobStatus)),
    req_people_count: getRandomInt(1, 30),
    start_date: `2022-${dayjs().format('MMM')}-${getRandomInt(1, 15)}`,
    end_date: `2022-${dayjs().format('MMM')}-${getRandomInt(16, 30)}`,
    project_id: '',
    task_id: '',
    github: 'https://github.com/' + getRandomArrayElement(['marvin', 'williams', 'samudai']),
    experience: getRandomInt(6, 120),
    questions: [
        {
            id: uuidv4(),
            title: 'What you do? (skills)',
        },
        {
            id: uuidv4(),
            title: 'How much time do you work per day?',
        },
        {
            id: uuidv4(),
            title: 'Preferred work schedule?',
        },
    ],
    captain: Boolean(Math.round(Math.random())),
    skills: ['Design', 'Design Systems', 'User Research', 'User Flow'],
    tags: ['Design', 'Develop', 'Animation'],
    payout_amount: getRandomInt(50, 10000),
    payout_currency: 'USDT',
    created_by: getRandomArrayElement(mockup_users),
    open_to: [JobRole.DAO_MEMBERS, JobRole.DAOs],
    format: getRandomArrayElement(Object.values(JobFormat)),
    contacts: getRandomArrayLength(1, 4).map((_, id) => mockup_users[id]),
    department: getRandomArrayElement(['Development', 'Managment', 'Design']),
    winners_amount: getRandomInt(1, 10),
    updated_at: '2022-09-2022',
    created_at: '2022-09-2022',
}));
