import { IMessage } from 'utils/types/Chat';
import { mockup_users } from './users';

export const mockup_messages: IMessage[] = [
    {
        id: '1',
        user: mockup_users[1],
        text: 'Hello! How are you today? 😍',
        attachments: [],
        readed: false,
        reply: [],
        updated_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
        created_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
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
                updated_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
                created_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
            },
        ],
        updated_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
        created_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
    },
    {
        id: '3',
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
        updated_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
        created_at: new Date(Date.now() - 1000 * (Math.random() * 1000)).toISOString(),
    },
];
