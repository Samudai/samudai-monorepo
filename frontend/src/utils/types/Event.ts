export interface IEvent {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time_from: string;
    time_to: string;
    location: string;
    link: string;
    members: IUser[];
}

interface IUser {
    id: string;
    avatar: string;
}
