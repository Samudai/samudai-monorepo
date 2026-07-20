export interface IUser {
    id: string; // member_id
    link: string; //rename did
    fullname: string; //username
    location: string; //no
    avatar: string; //profile_picture ->link
    rating: UserRating; //no
    education: string; //no
    languages: string[]; //no
    about: string | null; //empty
    private: boolean; //no
    open_for_jobs: boolean; //open for opportunity
    balance: {
        //no
        btc: number; //wallet address & chain
    };
    socials: {
        discord: string | null;
        linkedIn: string | null;
        github: string | null;
        behance: string | null;
        dribbble: string | null;
    };
    skills: ISkill[]; //empty
    task_count?: number;
    updated_at: string;
    created_at: string;
    role: Roles; //no
    profession: string; //no
}

export enum Roles {
    ADMIN = 'DAO Admin',
    CAPTAIN = 'DAO Captain',
    CONTRIBUTOR = 'Contributor',
}

export enum UserRating {
    A = 'A+',
    B = 'B+',
    C = 'C+',
}
export interface ISkill {
    id: number | string;
    name: string;
    icon: string | null;
}
export interface IMember {
    member_id: string;
    username: string;
    name?: string;
    profile_picture?: string;
}
