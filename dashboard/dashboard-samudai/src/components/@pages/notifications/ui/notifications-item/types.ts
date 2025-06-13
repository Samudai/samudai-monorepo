export interface NotificationBase {
    tags?: string[];
}

export interface Notification1 extends NotificationBase {
    type: 'not-1';
    user?: {
        name: string;
        profile_picture: string;
        location: string;
    };
    rating?: string;
    text: string;
    date: string;
    id: string;
    onView?: () => void;
}

export interface Notification2 extends NotificationBase {
    type: 'not-2';
    user: {
        name: string;
        profile_picture: string;
    };
    text: string;
    date: string;
    onCancel?: () => void;
    onConfirm?: () => void;
}

export interface Notification3 extends NotificationBase {
    type: 'not-3';
    title: string;
    category: string;
    projectName: string;
    status: string;
    oldStatus: string;
    date: string;
    members: { name: string; profile_picture: string }[];
    onView?: () => void;
}

export interface Notification4 extends NotificationBase {
    type: 'not-4';
    user: {
        name: string;
        profile_picture: string;
    };
    text: string;
    date: string;
    onCancel?: () => void;
}

export interface Notification5 extends NotificationBase {
    type: 'not-5';
    user: {
        name: string;
        profile_picture: string;
    };
    text: string;
    date: string;
    onView?: () => void;
}

export interface Notification6 extends NotificationBase {
    type: 'not-6';
    title: string;
    location: string;
    startDate: string;
    date: string;
    onView?: () => void;
}

export interface Notification7 extends NotificationBase {
    type: 'not-7';
    title: string;
    votesFor: number;
    votesAgain: number;
    status: string;
    date: string;
}

export interface Notification8 extends NotificationBase {
    type: 'not-8';
    user: {
        name: string;
        profile_picture: string;
    };
    title: string;
    date: string;
    text: string;
    onDelete: () => void;
    onAccept: () => void;
}

export interface Notification9 extends NotificationBase {
    type: 'not-9';
    user: {
        name: string;
        profile_picture: string;
    };
    title: string;
    date: string;
}

export interface Notification10 extends NotificationBase {
    type: 'not-10';
    user: {
        name: string;
        profile_picture: string;
        role: string;
    };
    title: string;
    date: string;
    onReject?: () => void;
    onAccept?: () => void;
}

export type NotificationProps =
    | Notification1
    | Notification2
    | Notification3
    | Notification6
    | Notification7
    | Notification8
    | Notification9
    | Notification10;
