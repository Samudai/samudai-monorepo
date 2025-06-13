import axios, { AxiosResponse } from 'axios';
import { Guild, GuildMember, GuildScheduledEvent, Role } from 'discord.js';
import { mapEvent, mapGuild, mapMember, mapRole } from './mapper';
import { EventData, GuildData, GuildMemberData, RoleData } from './types';

export const saveGuild = (guild: Guild): Promise<AxiosResponse> => {
  const guildSchema: GuildData = mapGuild(guild);
  // console.log('Guildschema', guildSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/dao/create`, {
    guild_data: guildSchema
  });
};

export const saveMembers = async (
  guild: Guild,
  daoId: string
): Promise<AxiosResponse> => {
  const members = await guild.members.fetch();
  const memeberSchema: GuildMemberData[] = members.map((member: GuildMember) =>
    mapMember(member)
  );

  // console.log("MEMBER SCHEMA", memeberSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/member/addbulk`, {
    members: memeberSchema,
    dao_id: daoId
  });
};

export const savePointMembers = async (
  guild: Guild,
  pointId: string
): Promise<AxiosResponse> => {
  const members = await guild.members.fetch();
  const memeberSchema: GuildMemberData[] = members.map((member: GuildMember) =>
    mapMember(member)
  );

  // console.log("MEMBER SCHEMA", memeberSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/member/addbulk`, {
    members: memeberSchema,
    point_id: pointId
  });
};

export const saveRoles = async (guild: Guild, daoId: string): Promise<AxiosResponse> => {
  const roles = await guild.roles.fetch();
  const rolesSchema: RoleData[] = roles.map((role: Role) => mapRole(role));

  // console.log("ROLE SCHEMA", rolesSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/role/addbulk`, {
    guild_id: guild.id,
    roles: rolesSchema,
    dao_id: daoId
  });
};

export const savePointRoles = async (guild: Guild, pointId: string): Promise<AxiosResponse> => {
  const roles = await guild.roles.fetch();
  const rolesSchema: RoleData[] = roles.map((role: Role) => mapRole(role));

  // console.log("ROLE SCHEMA", rolesSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/role/addbulk`, {
    guild_id: guild.id,
    roles: rolesSchema,
    point_id: pointId
  });
};

export const saveOwner = async (guild: Guild, daoId: string): Promise<AxiosResponse> => {
  const owner = await guild.fetchOwner();

  // console.log("ROLE SCHEMA", rolesSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/dao/addowner`, {
    guild_id: guild.id,
    member_discord_id: owner.user.id,
    dao_id: daoId
  });
};

export const saveEvents = async (guild: Guild, daoId: string) => {
  const events = await guild.scheduledEvents.fetch();
  let eventsSchema: EventData[] = [];
  events.forEach(async (value: GuildScheduledEvent, key) => {
    const e: GuildScheduledEvent = await guild.scheduledEvents.fetch(value.id);
    eventsSchema.push(mapEvent(e));
  });

  // console.log("EVENT SCHEMA", eventsSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/event/addbulk`, {
    guild_id: guild.id,
    events: eventsSchema,
    dao_id: daoId
  });
};

export const updateGuild = (guild: Guild, daoId: string): Promise<AxiosResponse> => {
  const guildSchema: GuildData = mapGuild(guild);
  // console.log('Guildschema', guildSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/dao/linkdiscord`, {
    dao_id: daoId,
    guild_data: guildSchema
  });
};

export const updatePointGuild = (guild: Guild, pointId: string): Promise<AxiosResponse> => {
  const guildSchema: GuildData = mapGuild(guild);
  // console.log('Guildschema', guildSchema);
  return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/linkdiscord`, {
    point_id: pointId,
    guild_data: guildSchema
  });
};
// export const saveChannels = async (guild: Guild): Promise<AxiosResponse> => {
//   const channels = await guild.channels.fetch();
//   let channelSchema: NonThreadGuildBasedChannel[] = [];
//   channels.forEach((value, key) => {
//     channelSchema.push({
//       type: value.type,
//       guildId: value.guildId,
//       parentId: value.parentId,
//       permissionOverwrites: value.permissionOverwrites,
//       nsfw: value.nsfw,
//       id: value.id,
//       name: value.name,
//       rawPosition: value.rawPosition,
//       topic: value.topic,
//       rateLimitPerUser: value.rateLimitPerUser,
//       bitrate: value.bitrate,
//       rtcRegion: value.rtcRegion,
//       userLimit: value.userLimit
//     });
//   });

//   // console.log("CHANNEL SCHEMA", channelSchema);
//   return axios.post(`${process.env.GATEWAY_EXTERNAL}/discordbot/channel/addbulk`, {
//     channels: channels
//   });
// }
