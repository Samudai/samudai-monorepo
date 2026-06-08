export const services = [
    // { icon: '/img/socials/github.svg', name: 'GitHub' },
    // { icon: '/img/socials/trello.svg', name: 'Trello' },
    { icon: '/img/socials/notion.svg', name: 'Notion' },
];

export const progressList = ['In Progress', 'Not Started', 'In Review', 'Done'];

export enum Steps {
    CHOOSE,
    IMPORTING,
    DONE,
    ORDER,
    ERROR, // Not realised
}

// Types
export type ServiceType = (typeof services)[0];
