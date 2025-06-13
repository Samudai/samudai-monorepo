require('dotenv').config();

export const discordOAuth = (host) =>
    `https://discord.com/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&redirect_uri=${host}&response_type=code&scope=identify%20email%20guilds`;

// Admin permissions: https://discordapi.com/permissions.html#8
// export const discordBot = (host, guildId) => `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&permissions=8&redirect_uri=${host}&response_type=code&scope=identify%20bot%20applications.commands%20email&guild_id=${guildId}&disable_guild_select=true`

export const discordBot = (host, guildId) =>
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&permissions=8590535808&redirect_uri=${host}&response_type=code&scope=identify%20bot%20applications.commands%20email&guild_id=${guildId}&disable_guild_select=true`;

export const gitHubContributor = (host) =>
    `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${host}&scope=repo`;

export const gitHubAdmin = () =>
    `https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_APP_NAME}/installations/new?state=test`;

export const notionAuth = (host) =>
    `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.REACT_APP_NOTION_CLIENT_ID}&redirect_uri=${host}&state=test&response_type=code`;
