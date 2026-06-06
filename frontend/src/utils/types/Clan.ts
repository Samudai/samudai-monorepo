import { ISkill } from './User';

export interface IClanInfo {
    id: string;
    name: string;
    logo: string;
    projects: {
        active: IClanInfoProject[];
        completed: IClanInfoProject[];
    };
    earned_badges: IClanInfoEarnedBadges[];
    members: IClanInfoUser[];
    admin: IClanInfoUser;
    skills: ISkill[];
    reviews: IClanInfoReview;
    applications: IClanInfoApplication[];
    total_bounty: IClanInfoBounty;
    chat_id: number;
}
export interface IClanInfoBounty {
    value: number;
    data: number[];
}
export interface IClanInfoProject {
    id: string;
    title: string;
    progress: number;
}
export interface IClanInfoEarnedBadges {
    id: string;
    icon: string;
    count: number;
}
export interface IClanInfoUser {
    id: string;
    avatar: string;
    name: string;
}
interface ClanMember {
    member_id: string;
    username: string;
    name?: string;
    profile_picture?: string | null;
}
export interface IClanInfoReview {
    rating: number;
    votes: number;
    popular_reviews: IClanInfoReviewItem[];
}
export interface IClanInfoReviewItem {
    id: string;
    user: ClanMember;
    rating: number;
    text: string;
}
export interface IClanInfoApplication {
    id: string;
    title: string;
    skills: ISkill[];
    min_people: number;
    payout: string;
    open_roles: string[];
}
