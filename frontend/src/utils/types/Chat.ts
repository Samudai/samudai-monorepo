import { IUser } from './User';

interface C_IUser {
    id: string;
    first_name: string;
    last_name: string;
    link: string;
    unread_messages: number;
}
export interface IChat {
    id: string;
    user: C_IUser;
    updated_at: string;
    created_at: string;
}

export interface IMessage {
    id: string;
    user: IUser;
    reply: IMessage[];
    text: string;
    readed: boolean;
    attachments: IAttachment[];
    updated_at: string;
    created_at: string;
}
export interface IAttachment {
    id: string;
    name: string;
    size: string;
    url: string;
}
