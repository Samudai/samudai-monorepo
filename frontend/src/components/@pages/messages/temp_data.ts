import { mockup_users } from 'root/mockup/users';
import { MsgAttachmentsType } from 'components/chat/utils/files';
import { IMessage } from 'utils/types/Chat';

export const data: IMessage[] = [
    {
        id: '1',
        user: mockup_users[1],
        text: 'Hello! How are you today? 😍',
        attachments: [],
        readed: false,
        reply: [],
        updated_at: new Date(Date.now() - 1000 * 600).toISOString(),
        created_at: new Date(Date.now() - 1000 * 600).toISOString(),
    },
    {
        id: '2',
        user: mockup_users[2],
        text: 'Hello! I’m good! How are you today?',
        attachments: [],
        readed: true,
        reply: [
            {
                id: '1',
                user: mockup_users[1],
                text: 'Hello! How are you today? 😍',
                attachments: [],
                readed: false,
                reply: [],
                updated_at: new Date(Date.now() - 1000 * 600).toISOString(),
                created_at: new Date(Date.now() - 1000 * 600).toISOString(),
            },
        ],
        updated_at: new Date(Date.now() - 1000 * 550).toISOString(),
        created_at: new Date(Date.now() - 1000 * 550).toISOString(),
    },
    {
        id: '1',
        user: mockup_users[1],
        text: '',
        attachments: [
            {
                id: '1',
                name: 'Presentation.mp4',
                size: '489KB',
                url: '/mockup/img/attachment-1.png',
            },
            {
                id: '2',
                name: 'Reference.jpeg',
                size: '489KB',
                url: '/mockup/img/attachment-2.png',
            },
        ],
        readed: false,
        reply: [],
        updated_at: new Date(Date.now() - 1000 * 400).toISOString(),
        created_at: new Date(Date.now() - 1000 * 400).toISOString(),
    },
];
export const attachments1: MsgAttachmentsType[] = [
    {
        id: '1',
        name: 'Finance KPI App Guidelines.pdf',
        size: '489KB',
        date: '2022-08-29T11:54:32.846Z',
        url: '',
    },
    {
        id: '2',
        name: 'Finance Reports.html',
        size: '5MB',
        date: '2022-08-29T11:27:32.846Z',
        url: '',
    },
    {
        id: '3',
        name: 'Finances.html',
        size: '222KB',
        date: '2022-08-12T11:27:32.846Z',
        url: '',
    },
    {
        id: '4',
        name: 'Presentation.webp',
        size: '1MB',
        date: '2022-08-12T13:44:11.846Z',
        url: '/mockup/img/attachment-1.png',
    },
    {
        id: '5',
        name: 'User Flow.jpeg',
        size: '350KB',
        date: '2022-08-12T11:35:20.846Z',
        url: '/mockup/img/attachment-2.png',
    },
    {
        id: '6',
        name: 'Reference.jpeg',
        size: '155KB',
        date: '2022-09-12T11:35:20.846Z',
        url: '/mockup/img/attachment-1.png',
    },
    {
        id: '7',
        name: 'Client UAT Testing Results.doc',
        size: '15MB',
        date: '2022-09-12T17:35:20.846Z',
        url: '',
    },
    {
        id: '8',
        name: 'Finance KPI App Guidelines.html',
        size: '15MB',
        date: '2022-09-12T17:35:20.846Z',
        url: '',
    },
    {
        id: '9',
        name: 'Finance Reports.html',
        size: '2MB',
        date: '2022-09-12T17:35:20.846Z',
        url: '',
    },
    {
        id: '10',
        name: 'Presentation.jpeg',
        size: '0.5MB',
        date: '2022-09-12T17:35:20.846Z',
        url: '/mockup/img/attachment-1.png',
    },
    {
        id: '11',
        name: 'Proposals.png',
        size: '1.1MB',
        date: '2022-09-12T17:35:20.846Z',
        url: '/mockup/img/attachment-2.png',
    },
];

export const attachments: MsgAttachmentsType[] = [];
