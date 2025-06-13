import axios from 'axios';
import {
  Guild,
  GuildMember,
  GuildScheduledEvent,
  PartialGuildMember,
  Role,
  User
} from 'discord.js';
import {
  saveEvents,
  saveGuild,
  saveMembers,
  saveOwner,
  savePointMembers,
  savePointRoles,
  saveRoles,
  updateGuild,
  updatePointGuild
} from './guildData';
import { mapEvent, mapGuild, mapMember, mapRole, mapUser } from './mapper';
import { EventData, GuildMemberData, RoleData, UserData } from './types';

export const guildCreate = async (guild: Guild) => {
  console.log(`Joined guild ${guild.name}`);
  try {
    // Guild Data
    const response = await saveGuild(guild);
    console.log(response.data, response.status, 'Guild create discord create');

    // // channels
    // const channelResponse = await saveChannels(guild)
    // console.log(channelResponse.data, channelResponse.status, 'interaction create add channels');

    const daoId: string = response.data.dao_id;

    // roles
    const roleResponse = await saveRoles(guild, daoId);
    console.log(roleResponse.data, roleResponse.status, 'interaction create add roles');

    // members
    const memberResponse = await saveMembers(guild, daoId);
    console.log(
      memberResponse.data,
      memberResponse.status,
      'interaction create add members'
    );

    // owner
    const ownerResponse = await saveOwner(guild, daoId);
    console.log(response.data, response.status, 'Owner Added');

    // events
    const eventsResponse = await saveEvents(guild, daoId);
    console.log(
      eventsResponse.data,
      eventsResponse.status,
      'interaction create add events'
    );

    const onboardingResponse = await axios.post(
      `${process.env.GATEWAY_CONSUMER}/api/onboarding/add`,
      {
        linkId: daoId,
        stepId: 'BOT_ADDED',
        value: {
          dao_id: daoId
        }
      }
    );
    console.log(
      onboardingResponse.data,
      onboardingResponse.status,
      'interaction create onboarding'
    );
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = 'Error occured while creating DAO';
      error = err.response.data;
    } else if (err.request) {
      message = 'error while requesting data';
      error = JSON.stringify(err.request);
    } else {
      message = 'error occured';
      error = err;
    }
    console.log(message, error);
  }
};

export const guildUpdate = (oldGuild: Guild, newGuild: Guild) => {
  console.log(`Guild ${oldGuild.name} updated`);
  const guildSchema = mapGuild(newGuild);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/dao/update`, {
      guild_data: guildSchema
    })
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save guild failed!';
        error = err.response.data;
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

// on bot removal the dao is not removed
export const guildDelete = (guild: Guild) => {
  console.log(`Left guild ${guild.name}`);
  axios
    .delete(`${process.env.GATEWAY_EXTERNAL}/discordbot/guild/delete/${guild.id}`)
    .then(() => console.log('BOT LEFT GUILD'))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save guild failed!';
        error = err.response.data;
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

// Members
export const guildMemberAdd = (member: GuildMember) => {
  console.log('new member joined', member);
  const memeberSchema: GuildMemberData = mapMember(member);

  console.log(member);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/member/add`, {
      member: memeberSchema
    })
    .then(() => console.log(`MEMBER ADDED: ${member.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const guildMemberRemove = (member: GuildMember | PartialGuildMember) => {
  axios
    .delete(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/member/delete/${member.guild.id}/${member.user.id}`
    )
    .then(() => console.log(`MEMBER LEFT ${member.user.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'delete member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const guildMemberUpdate = (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) => {
  const newMemeberSchema: GuildMemberData = mapMember(newMember);

  let newRoles = newMember.roles.cache.map((role) => role.id);
  let oldRoles = oldMember.roles.cache.map((role) => role.id);

  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/member/update`, {
      member: newMemeberSchema,
      old_roles: oldRoles,
      new_roles: newRoles
    })
    .then(() => console.log(`UPDATED MEMBER SCHEMA ${newMemeberSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'update member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

// Roles
export const guildRoleCreate = (role: Role) => {
  const roleSchema: RoleData = mapRole(role);

  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/role/add`, {
      guild_id: role.guild.id,
      role: roleSchema
    })
    .then(() => console.log(`ROLE SCHEMA created ${roleSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

// TODO: think on this
export const guildRoleDelete = (role: Role) => {
  axios
    .delete(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/role/delete/${role.guild.id}/${role.id}`
    )
    .then(() => console.log(`ROLE SCHEMA deleted ${role.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'delete role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildRoleUpdate = (oldRole: Role, newRole: Role) => {
  const roleSchema: RoleData = mapRole(newRole);

  // console.log('ROLE SCHEMA', roleSchema)
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/role/update`, {
      guild_id: newRole.guild.id,
      role: roleSchema
    })
    .then(() => console.log(`ROLE SCHEMA updated ${roleSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'update role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildScheduledEventCreate = async (event: GuildScheduledEvent) => {
  const eventSchema: EventData = mapEvent(event);

  // console.log("EVENT SCHEMA", eventSchema);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/event/add`, {
      guild_id: event.guild!.id,
      event: eventSchema
    })
    .then(() => console.log(`EVENT SCHEMA created ${eventSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save event failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildScheduledEventDelete = async (event: GuildScheduledEvent) => {
  axios
    .delete(`${process.env.GATEWAY_EXTERNAL}/discordbot/event/delete/${event.id}`)
    .then(() => console.log(`EVENT SCHEMA deleted ${event.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'delete event failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const guildScheduledEventUpdate = async (
  oldEvent: GuildScheduledEvent | null,
  newEvent: GuildScheduledEvent
) => {
  const eventSchema: EventData = mapEvent(newEvent);

  // console.log("EVENT SCHEMA", eventSchema);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/event/update`, {
      guild_id: newEvent.guild!.id,
      event: eventSchema
    })
    .then(() => console.log(`EVENT SCHEMA updated ${eventSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'update event failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildScheduledEventUserAdd = async (
  event: GuildScheduledEvent,
  user: User
) => {
  const userSchema: UserData = mapUser(user);

  // console.log("EVENT SCHEMA", userSchema);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/event/useradd`, {
      guild_id: event.guild!.id,
      event_id: event.id,
      user: userSchema
    })
    .then(() => console.log(`EVENT SCHEMA user added ${userSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'add user to event failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildScheduledEventUserRemove = async (
  event: GuildScheduledEvent,
  user: User
) => {
  const userSchema: UserData = mapUser(user);

  // console.log("EVENT SCHEMA", userSchema);
  axios
    .delete(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/event/userremove/${event.id}/${userSchema.id}`
    )
    .then(() => console.log(`EVENT SCHEMA user removed ${userSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'remove user from event failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

// Point

export const guildMemberAddPoint = (member: GuildMember) => {
  console.log('new member joined', member);
  const memeberSchema: GuildMemberData = mapMember(member);

  console.log(member);
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/member/add`, {
      member: memeberSchema
    })
    .then(() => console.log(`MEMBER ADDED: ${member.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const guildMemberRemovePoint = (member: GuildMember | PartialGuildMember) => {
  axios
    .delete(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/point/member/delete/${member.guild.id}/${member.user.id}`
    )
    .then(() => console.log(`MEMBER LEFT ${member.user.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'delete member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      } else {
        message = 'error occured';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const guildMemberUpdatePoint = (
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
) => {
  const newMemeberSchema: GuildMemberData = mapMember(newMember);

  let newRoles = newMember.roles.cache.map((role) => role.id);
  let oldRoles = oldMember.roles.cache.map((role) => role.id);

  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/member/update`, {
      member: newMemeberSchema,
      old_roles: oldRoles,
      new_roles: newRoles
    })
    .then(() => console.log(`UPDATED MEMBER SCHEMA ${newMemeberSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'update member failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err);
      }
      console.log(message, error);
    });
};

export const linkDiscordToDao = async (guild: Guild, daoId: string) => {
  try {
    const response = await updateGuild(guild, daoId);
    console.log(response.data, response.status, 'Guild create discord create');

    // roles
    const roleResponse = await saveRoles(guild, daoId);
    console.log(roleResponse.data, roleResponse.status, 'interaction create add roles');

    // members
    const memberResponse = await saveMembers(guild, daoId);
    console.log(
      memberResponse.data,
      memberResponse.status,
      'interaction create add members'
    );

    // events
    const eventsResponse = await saveEvents(guild, daoId);
    console.log(
      eventsResponse.data,
      eventsResponse.status,
      'interaction create add events'
    );
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = 'Error occured while linking discord to DAO';
      error = err.response.data;
    } else if (err.request) {
      message = 'error while requesting data';
      error = JSON.stringify(err.request);
    } else {
      message = 'error occured';
      error = err;
    }
    console.log(message, error);
  }
};

export const linkDiscordToPoint = async (guild: Guild, pointId: string) => {
  try {
    const response = await updatePointGuild(guild, pointId);
    console.log(response.data, response.status, 'Guild create discord create');

    // roles
    const roleResponse = await savePointRoles(guild, pointId);
    console.log(roleResponse.data, roleResponse.status, 'interaction create add roles');

    // members
    const memberResponse = await savePointMembers(guild, pointId);
    console.log(
      memberResponse.data,
      memberResponse.status,
      'interaction create add members'
    );

    // events
    // const eventsResponse = await saveEvents(guild, pointId);
    // console.log(
    //   eventsResponse.data,
    //   eventsResponse.status,
    //   'interaction create add events'
    // );
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = 'Error occured while linking discord to Point';
      error = err.response.data;
    } else if (err.request) {
      message = 'error while requesting data';
      error = JSON.stringify(err.request);
    } else {
      message = 'error occured';
      error = err;
    }
    console.log(message, error);
  }
};

// Points
export const guildRoleCreatePoints = (role: Role) => {
  const roleSchema: RoleData = mapRole(role);

  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/role/addPoints`, {
      guild_id: role.guild.id,
      role: roleSchema
    })
    .then(() => console.log(`ROLE SCHEMA created ${roleSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'save role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};

export const guildRoleUpdatePoints = (oldRole: Role, newRole: Role) => {
  const roleSchema: RoleData = mapRole(newRole);

  // console.log('ROLE SCHEMA', roleSchema)
  axios
    .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/point/role/updatePoints`, {
      guild_id: newRole.guild.id,
      role: roleSchema
    })
    .then(() => console.log(`ROLE SCHEMA updated ${roleSchema.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'update role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};
// Points
export const guildRoleDeletePoints = (role: Role) => {
  axios
    .delete(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/point/role/deletePoints/${role.guild.id}/${role.id}`
    )
    .then(() => console.log(`ROLE SCHEMA deleted ${role.id}`))
    .catch((err) => {
      let message, error;
      if (err.response) {
        message = 'delete role failed!';
        error = err.response.data;
      } else if (err.request) {
        message = 'error while requesting data';
        error = JSON.stringify(err.request);
      }
      console.log(message, error);
    });
};
// Channels
// client.on('channelCreate', (channel) => {
//   let channelSchema = [];
//   channelSchema.push({
//     type: channel.type,
//     guildId: channel.guildId,
//     parentId: channel.parentId,
//     permissionOverwrites: channel.permissionOverwrites,
//     nsfw: channel.nsfw,
//     id: channel.id,
//     name: channel.name,
//     rawPosition: channel.rawPosition,
//     topic: channel.topic,
//     rateLimitPerUser: channel.rateLimitPerUser,
//     bitrate: channel.bitrate,
//     rtcRegion: channel.rtcRegion,
//     userLimit: channel.userLimit
//   });

//   axios
//     .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/channel/addbulk`, {
//       channels: channelSchema
//     })
//     .then(console.log('CHANNEL SCHEMA created', channelSchema))
//     .catch((err) => {
//       let message, error
//       if (err.response) {
//         message = 'save channel failed!'
//         error = err.response.data
//       } else if (err.request) {
//         message = 'error while requesting data'
//         error = JSON.stringify(err.request)
//       }
//       console.log(message, error);
//     });
// });

// client.on('channelDelete', (channel) => {
//   axios
//     .delete(
//       `${process.env.GATEWAY_EXTERNAL}/discordbot/channel/delete/${channel.guildId}/${channel.id}`
//     )
//     .then(console.log('CHANNEL SCHEMA deleted'));
// });

// client.on('channelUpdate', (oldChannel, newChannel) => {
//   let channelSchema = {
//     type: newChannel.type,
//     guildId: newChannel.guildId,
//     parentId: newChannel.parentId,
//     permissionOverwrites: newChannel.permissionOverwrites,
//     id: newChannel.id,
//     name: newChannel.name,
//     rawPosition: newChannel.rawPosition,
//     nsfw: newChannel.nsfw
//   };

//   axios
//     .post(`${process.env.GATEWAY_EXTERNAL}/discordbot/channel/update`, {
//       channel: channelSchema
//     })
//     .then(console.log('CHANNEL SCHEMA updated', channelSchema))
//     .catch((err) => {
//       let message, error
//       if (err.response) {
//         message = 'update channel failed!'
//         error = err.response.data
//       } else if (err.request) {
//         message = 'error while requesting data'
//         error = JSON.stringify(err.request)
//       }
//       console.log(message, error);
//     });
// });
