export interface CommonSliceState {
    discord: discordData;
    selectedDiscord: GuildStatus;
    trialDashboard: boolean;
    goTo?: number;
    scrollToFeatured: boolean;
}

export interface discordData {
    guildsInfo: GuildInfo[];
    memberGuilds: MemberGuilds;
}

export type GuildStatus = {
    id: string;
    name: string;
    dao_id?: string;
    isOnboarded: boolean;
    onboardingIntegration?: any;
    onboardingData?: any;
    goTo?: {
        step: number;
        name: string;
    };
};

export type MemberGuilds = {
    [key: string]: GuildStatus;
};

export type GuildInfo = {
    label: string;
    value: string;
};

export const initialState: CommonSliceState = {
    discord: {
        guildsInfo: [],
        memberGuilds: {},
    },
    selectedDiscord: {
        id: '',
        name: '',
        isOnboarded: false,
    },
    trialDashboard: false,
    goTo: undefined,
    scrollToFeatured: false,
};
