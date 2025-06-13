import {
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  Guild,
  ShardEvents,
  SlashCommandBuilder,
  User
} from 'discord.js';
import { NextFunction, Request, Response } from 'express';
import {
  guildCreate,
  guildDelete,
  guildMemberAdd,
  guildMemberRemove,
  guildMemberUpdate,
  guildRoleCreate,
  guildRoleDelete,
  guildRoleUpdate,
  guildScheduledEventCreate,
  guildScheduledEventDelete,
  guildScheduledEventUpdate,
  guildScheduledEventUserAdd,
  guildScheduledEventUserRemove,
  guildUpdate,
  linkDiscordToDao,
  linkDiscordToPoint,
  guildRoleCreatePoints,
  guildRoleDeletePoints,
  guildRoleUpdatePoints,
  guildMemberAddPoint,
  guildMemberRemovePoint,
  guildMemberUpdatePoint
} from './ready';
import axios from 'axios';
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping
  ]
});

client.once('ready', async () => {
  console.log('Bot is ready!');

  const givepoints = new SlashCommandBuilder()
    .setName('givepoints')
    .setDescription('Give points to a user')
    .addIntegerOption((option) =>
      option
        .setName('points')
        .setDescription('Number of points to give')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Reason for giving points')
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('User to give points to').setRequired(true)
    );

  const leaderboard = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Get points Leaderboard');

  const info = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Fetches User information');

  await client?.application?.commands.create(givepoints as any);
  await client?.application?.commands.create(leaderboard as any);
  await client?.application?.commands.create(info as any);
  console.log('Global command registered');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'givepoints') {
    const points = options.get('points');
    const description = options.get('description');
    const user = options.getUser('user');
    console.log(points, description, user);
    // Log the user ID of the person who executed the command
    console.log(`Command executed by user ID: ${interaction.user.id}`);

    try {
      const result = await axios.post(
        `${process.env.GATEWAY_EXTERNAL}/discordbot/point/getaccess/formemberbyguildid`,
        {
          guild_id: interaction.guild?.id,
          discord_user_id: interaction.user.id
        }
      );
      console.log(result.data);

      if (result.data && result.data.access && result.data.access.access.includes('admin')) {
        console.log(result.data);
        const res = await axios.post(
          `${process.env.GATEWAY_EXTERNAL}/discordbot/event/addPointsNum`,
          {
            guild_id: interaction.guild?.id,
            guild_name: interaction.guild?.name,
            from: interaction.user.id,
            from_username: interaction.user.username,
            to: user?.id,
            to_username: user?.username,
            points: points?.value,
            description: description?.value,
            point_id: result.data.access.point_id,
            point_name: result.data.access.name,
          }
        );

        if (res.status === 200) {
          await interaction.reply(
            `Successfully Given ${points?.value} points to ${user?.username} for ${description?.value}.`
          );
          // await user!.send(
          //   `${interaction.user.username} has given ${points?.value} points to you for ${description?.value}.`
          // );
        } else {
          await interaction.reply(`Something went Wrong.`);
        }
      } else {
        await interaction.reply(
          `You dont have the access to give points. Please ask to your Admin to grant access.`
        );
      }
    } catch (error) {
      await interaction.reply(
        `You dont have the access to give points. Please ask to your Admin to grant access.`
      );
    }
  } else if (commandName === 'leaderboard') {
    const res = await axios.get(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/point/event/getLeaderBoard/${interaction.guild?.id}/1/10`
    );

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Leaderboard')
      .setDescription('Here is the leaderboard:')
      .addFields(
        {
          name: 'Username',
          value: res.data.leaderboard.map((item: any) => item.username).join('\n'),
          inline: true
        },
        {
          name: 'Points',
          value: res.data.leaderboard.map((item: any) => item.points_num).join('\n'),
          inline: true
        }
      );
    // Send the embed as a reply
    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'info') {
    const res = await axios.get(
      `${process.env.GATEWAY_EXTERNAL}/discordbot/getInfo/${interaction.guild?.id}/${interaction.user.id}`
    );
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Info')
      .addFields(
        {
          name: 'Community Dashboard URL',
          value: res.data.dashboard_url
        },
        {
          name: 'Your points',
          value: res.data.points.toString()
        }
      )
      .addFields({
        name: 'LeaderBoard ',
        value: 'Top 5 point holders of your community: '
      })
      .addFields(
        {
          name: 'Username',
          value: res.data.leaderboard.map((item: any) => item.username).join('\n'),
          inline: true
        },
        {
          name: 'Points',
          value: res.data.leaderboard.map((item: any) => item.points_num).join('\n'),
          inline: true
        }
      );

    // Send the embed as a reply
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

client
  .login(process.env.BOT_TOKEN)
  .then(() => {
    console.log('Bot is logged in');
  })
  .catch((err) => console.log(err));

// client.on(Events.GuildCreate, guildCreate);
// client.on(Events.GuildUpdate, guildUpdate);
// client.on(Events.GuildDelete, guildDelete);

// client.on(Events.GuildMemberAdd, guildMemberAdd);
// client.on(Events.GuildMemberRemove, guildMemberRemove);
// client.on(Events.GuildMemberUpdate, guildMemberUpdate);

// client.on(Events.GuildRoleCreate, guildRoleCreate);
// client.on(Events.GuildRoleDelete, guildRoleDelete);
// client.on(Events.GuildRoleUpdate, guildRoleUpdate);

// client.on(Events.GuildScheduledEventCreate, guildScheduledEventCreate);
// client.on(Events.GuildScheduledEventUpdate, guildScheduledEventUpdate);
// client.on(Events.GuildScheduledEventDelete, guildScheduledEventDelete);

// client.on(Events.GuildScheduledEventUserAdd, guildScheduledEventUserAdd);
// client.on(Events.GuildScheduledEventUserRemove, guildScheduledEventUserRemove);

client.on(Events.GuildMemberAdd, guildMemberAddPoint);
client.on(Events.GuildMemberRemove, guildMemberRemovePoint);
client.on(Events.GuildMemberUpdate, guildMemberUpdatePoint);

client.on(Events.GuildRoleCreate, guildRoleCreatePoints);
client.on(Events.GuildRoleDelete, guildRoleDeletePoints);
client.on(Events.GuildRoleUpdate, guildRoleUpdatePoints);

// // Fetches all events like 'ready', 'messageCreate' etc
// const eventFiles = fs
//   .readdirSync('controllers/events')
//   .filter((file) => file.endsWith('.js'));
// try {
//   for (const file of eventFiles) {
//     const event = require(`./events/${file}`);
//     // console.log(event)
//     if (event.once) {
//       client.once(event.name, (...args) => event.execute(...args));
//     } else {
//       client.on(event.name, (...args) => event.execute(...args));
//     }
//   }
// } catch (error) {
//   console.log(error);
// }

// Fetches guild Object from guildId
const getGuild = async (guildId: string): Promise<Guild> => {
  // console.log(client)
  const Guilds = client.guilds.cache.map((guild) => guild);
  let guild = Guilds.filter((item: Guild) => {
    // console.log(item.id)
    if (guildId === item.id) return item;
  });
  return guild[0];
};

const getUser = async (userId: string): Promise<User> => {
  const Users = client.users.cache.map((user) => user);
  let user = Users.filter((item) => {
    // console.log(item.id)
    if (userId === item.id) return item;
  });
  // console.log(user);
  return user[0];
};

export const getGuildEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guildId = req.params.guildId;
    const guild: Guild = await getGuild(guildId);
    const events = await guild!.scheduledEvents.fetch();
    for (const [id, event] of events) {
      const e = await guild.scheduledEvents.fetch(id);
      console.log(e);
      const subs = await e.fetchSubscribers();
      console.log(subs);
    }
    // console.log(events);
    res.status(200).json({
      status: 'success',
      data: events
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

export const getMemberEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = req.params.memberId;
    const guildId = req.params.guildId;
    const guild = await getGuild(guildId);
    const member = await getUser(memberId);
    const events = await guild.scheduledEvents.fetch();
    // const events = await guild.members.scheduledEvents.fetch();
    // console.log(events);
    res.status(200).json({
      status: 'success',
      data: events
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

export const healthCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
      status: 'Samudai Bot is running!'
    });
  } catch (error) {
    next(error);
  }
};

export const linkDiscordToDAO = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const daoId = req.params.dao_id;
    const guildId = req.params.guild_id;
    const guild = await getGuild(guildId);

    const response = await linkDiscordToDao(guild, daoId);

    res.status(200).json({
      status: 'Successfully linked discord to Dao!!',
      data: `${response}`
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

export const linkDiscordToPOINT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pointId = req.params.point_id;
    const guildId = req.params.guild_id;
    const guild = await getGuild(guildId);

    const response = await linkDiscordToPoint(guild, pointId);

    res.status(200).json({
      status: 'Successfully linked discord to Point!!',
      data: `${response}`
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

export const getOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const memberId = req.params.memberId;
    const guildId = req.params.guildId;
    console.log(guildId);
    const guild = await getGuild(guildId);
    const owner = await guild.fetchOwner();
    console.log(owner);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      status: 'Samudai Bot is running!',
      owner: `${owner}`
    });
  } catch (error) {
    next(error);
  }
};
