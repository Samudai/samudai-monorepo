export type GuildData = {
    id: string;
    name: string;
    icon: string | null;
    available: boolean;
    splash: string | null;
    banner: string | null;
    description: string | null;
    member_count: number;
    joined_at: string;
    max_members: number | null;
    owner_id: string;
    features: string[];
};

export type GuildMemberData = {
    id: string;
    bot: boolean;
    username: string;
    discriminator: string;
    avatar: string | null;
    guild_id: string;
    joined_at: string;
    nickname: string | null;
    roles: string[];
};

export type GuildPointMemberData = {
    id: string;
    bot: boolean;
    username: string;
    discriminator: string;
    avatar: string | null;
    guild_id: string;
    joined_at: string;
    nickname: string | null;
    roles: string[];
    points_num: number;
};

export type RoleData = {
    id: string;
    guild_id: string;
    name: string;
    color: number;
    hoist: boolean;
    raw_position: number;
    permissions: string;
    position: number;
    managed: boolean;
    mentionable: boolean;
    tags: {
        bot_id: string | undefined;
        integration_id: string | undefined;
        premium_subscriber_role: boolean | undefined;
    } | null;
};

export type UserData = {
    id: string;
    bot: boolean | undefined;
    username: string | undefined;
    discriminator: string | undefined;
    avatar: string | null | undefined;
    created_at: string;
}

export type EventData = {
    id: string;
    guild_id: string
    channel_id: string | null;
    creator_id: string | null;
    name: string
    description: string | null;
    scheduled_start_timestamp: string | null;
    scheduled_end_timestamp: string | null;
    privacy_level: number;
    status: number | null;
    entity_type: number | null;
    entity_id: string | null;
    user_count: number | null;
    creator: UserData | null;
    entity_metadata: {
        location: string | null;
    } | null;
    image: string | null;
    users?: UserData[]
};
