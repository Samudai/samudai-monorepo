import { Guild, GuildMember, GuildScheduledEvent, Role, User } from 'discord.js';
import { getTimestamp } from "../utils/utils";
import { EventData, GuildData, GuildMemberData, GuildPointMemberData, RoleData, UserData } from './types';

export const mapGuild = (guild: Guild): GuildData => {
    return {
        id: guild.id,
        name: guild.name,
        icon: guild.icon,
        available: guild.available,
        splash: guild.splash,
        banner: guild.banner,
        description: guild.description,
        member_count: guild.memberCount,
        joined_at: getTimestamp(guild.joinedTimestamp),
        max_members: guild.maximumMembers,
        owner_id: guild.ownerId,
        features: guild.features,
    };
}

export const mapMember = (data: GuildMember): GuildMemberData => {
    return {
        id: data.user.id,
        bot: data.user.bot,
        username: data.user.username,
        discriminator: data.user.discriminator,
        avatar: data.user.avatar,
        guild_id: data.guild.id,
        joined_at: getTimestamp(data.joinedAt!),
        nickname: data.nickname,
        roles: data.roles.cache.map((role: Role) => role.id),
    };
}

export const mapPointMember = (data: GuildMember): GuildPointMemberData => {
    return {
        id: data.user.id,
        bot: data.user.bot,
        username: data.user.username,
        discriminator: data.user.discriminator,
        avatar: data.user.avatar,
        guild_id: data.guild.id,
        joined_at: getTimestamp(data.joinedAt!),
        nickname: data.nickname,
        roles: data.roles.cache.map((role: Role) => role.id),
        points_num: 0
    };
}

export const mapUser = (data: User): UserData => {
    return {
        id: data.id,
        bot: data.bot,
        username: data.username,
        discriminator: data.discriminator,
        avatar: data.avatar,
        created_at: getTimestamp(data.createdAt!),
    };
}

export const mapRole = (data: Role): RoleData => {
    return {
        id: data.id,
        guild_id: data.guild.id,
        name: data.name,
        color: data.color,
        hoist: data.hoist,
        raw_position: data.rawPosition,
        permissions: data.permissions.bitfield.toString(),
        position: data.position,
        managed: data.managed,
        mentionable: data.mentionable,
        tags: {
            bot_id: data.tags?.botId,
            integration_id: data.tags?.integrationId,
            premium_subscriber_role: data.tags?.premiumSubscriberRole,
        },
    };
}

export const mapEvent = (data: GuildScheduledEvent): EventData => {
    return {
        id: data.id,
        guild_id: data.guildId,
        channel_id: data.channelId,
        creator_id: data.creatorId,
        name: data.name,
        description: data.description,
        scheduled_start_timestamp: getTimestamp(data.scheduledStartTimestamp!),
        scheduled_end_timestamp: getTimestamp(data.scheduledEndTimestamp!),
        privacy_level: data.privacyLevel,
        status: data.status,
        entity_type: data.entityType,
        entity_id: data.entityId,
        user_count: data.userCount,
        creator: {
            id: data.creator!.id,
            bot: data.creator?.bot,
            username: data.creator?.username,
            discriminator: data.creator?.discriminator,
            avatar: data.creator?.avatar,
            created_at: getTimestamp(data.creator?.createdAt!),
        },
        entity_metadata: data.entityMetadata,
        image: data.image,
    };
}

