import { ITemporaryTaskItem } from './../types';

export const getMockTasks = (): ITemporaryTaskItem[] => [
    {
        task_id: 'sdsd',
        created_by: {
            member_id: '1',
            username: 'daymere',
            name: 'Daymere(Ivan)',
            profile_picture: '/img/icons/user-4.png',
        },
        departments: [
            { value: '1', label: 'Design' },
            { value: '2', label: 'Development' },
        ],
        title: 'Adaptive Version',
        status: 'Backlog',
        position: 65536,
    },
    {
        task_id: 'sdsd1',
        created_by: {
            member_id: '1',
            username: 'daymere',
            name: 'Daymere(Ivan)',
            profile_picture: '/img/icons/user-4.png',
        },
        departments: [{ value: '1', label: 'Design' }],
        title: 'Mockups',
        status: 'Backlog',
        position: 131072,
    },
    {
        task_id: 'sdsd2',
        created_by: {
            member_id: '2',
            username: 'Ann',
            name: 'Anastasia',
            profile_picture: '/img/icons/user-2.png',
        },
        departments: [
            { value: '1', label: 'Design' },
            { value: '4', label: 'Animation' },
        ],
        title: 'Stylegiude Updates',
        status: 'To Do',
        position: 65536,
    },
    {
        task_id: 'sdsd3',
        created_by: {
            member_id: '2',
            username: 'Ann',
            name: 'Anastasia',
            profile_picture: '/img/icons/user-2.png',
        },
        departments: [{ value: '3', label: 'Animationd' }],
        title: 'Animationd',
        status: 'To Do',
        position: 65536,
    },
    {
        task_id: 'sdsd4',
        created_by: {
            member_id: '3',
            username: 'alen',
            name: 'Alena Williams',
            profile_picture: '/img/icons/user-1.png',
        },
        departments: [
            { value: '6', label: 'Someelse' },
            { value: '7', label: 'Dev' },
        ],
        title: 'Adaptive Version 2',
        status: 'In Progress',
        position: 131072,
    },
    {
        task_id: 'sdsd11',
        created_by: {
            member_id: '4',
            username: 'alen',
            name: 'Phylp Marvin',
            profile_picture: '/img/icons/user-2.png',
        },
        departments: [{ value: '7', label: 'Dev' }],
        title: 'Lorem ipsum',
        status: 'Reviews',
        position: 65536,
    },
    {
        task_id: 'sdsd5',
        created_by: {
            member_id: '4',
            username: 'alen',
            name: 'Phylp Marvin',
            profile_picture: '/img/icons/user-2.png',
        },
        departments: [{ value: '7', label: 'Dev' }],
        title: 'Adaptive Version 1',
        status: 'In Progress',
        position: 65536,
    },
    {
        task_id: 'sdsd6',
        created_by: {
            member_id: '4',
            username: 'alen',
            name: 'Phylp Marvin',
            profile_picture: '/img/icons/user-2.png',
        },
        departments: [{ value: '1', label: 'Design' }],
        title: 'Adaptive Version',
        status: 'Done',
        position: 65536,
    },
    {
        task_id: 'sdsd7',
        created_by: {
            member_id: '3',
            username: 'alen',
            name: 'Anastasia',
            profile_picture: '/img/icons/user-3.png',
        },
        departments: [{ value: '2', label: 'Development' }],
        title: 'Not Adaptive Version',
        status: 'Done',
        position: 131072,
    },
];

export const getMockSubTasks = () => [
    {
        subtask_id: 'sdsd',
        title: 'Adaptive Version',
        col: 0,
        position: 65536,
    },
    {
        subtask_id: 'sdsd1',
        title: 'Mockups',
        col: 0,
        position: 131072,
    },
    {
        subtask_id: 'sdsd2',
        title: 'Stylegiude Updates',
        col: 1,
        position: 65536,
    },
    {
        subtask_id: 'sdsd3',
        title: 'Animationd',
        col: 1,
        position: 65536,
    },
    {
        subtask_id: 'sdsd4',
        title: 'Adaptive Version 2',
        col: 2,
        position: 131072,
    },
    {
        subtask_id: 'sdsd11',
        title: 'Lorem ipsum',
        col: 3,
        position: 65536,
    },
    {
        subtask_id: 'sdsd5',
        title: 'Adaptive Version 1',
        col: 2,
        position: 65536,
    },
    {
        subtask_id: 'sdsd6',
        title: 'Adaptive Version',
        col: 4,
        position: 65536,
    },
    {
        subtask_id: 'sdsd7',
        title: 'Not Adaptive Version',
        col: 4,
        position: 131072,
    },
];
