// Temporary date and types
// Need for Design
// Will remove in future
export interface IConnection {
    id: string;
    avatar: string;
    name: string;
    skills: string[];
    projects: number;
    bounty: number;
}

export interface IConnectList {
    connected: IConnection[];
    requests: IConnection[];
}
