package discord

// // Addchannels adds channels to the database
// func Addchannels(channels []discord.Channel) error {
// 	db := db.GetSQL()
// 	for _, channel := range channels {
// 		switch channel.Type {
// 		case "GUILD_CATEGORY":
// 			query := `INSERT INTO discord_channels (discord_channel_id, guild_id, parent_id, permission_overwrites, type,
// 				name, raw_position, deleted)
// 				VALUES ($1, $2, $3, COALESCE($4, '{}'::jsonb), $5, $6, $7, COALESCE($8, FALSE))`
// 			_, err := db.Exec(query, channel.ChannelID, channel.GuildID, channel.ParentID, channel.PermissionOverwrites, channel.Type, channel.Name, channel.RawPosition, channel.Deleted)
// 			if err != nil {
// 				return fmt.Errorf("Error adding channel - GUILD_CATEGORY: %w", err)
// 			}

// 		case "GUILD_TEXT":
// 			query := `INSERT INTO discord_channels (discord_channel_id, guild_id, parent_id, permission_overwrites, type,
// 				name, raw_position, deleted, nsfw, topic,
// 				last_message_id, rate_limit_per_user)
// 				VALUES ($1, $2, $3, COALESCE($4, '{}'::json), $5, $6, $7, COALESCE($8, FALSE), COALESCE($9, FALSE), $10, $11, $12)`
// 			_, err := db.Exec(query, channel.ChannelID, channel.GuildID, channel.ParentID, channel.PermissionOverwrites, channel.Type, channel.Name, channel.RawPosition, channel.Deleted, channel.NSFW, channel.Topic, channel.LastMessageID, channel.RateLimitPerUser)
// 			if err != nil {
// 				return fmt.Errorf("Error adding channel - GUILD_TEXT: %w", err)
// 			}

// 		case "GUILD_VOICE":
// 			query := `INSERT INTO discord_channels (discord_channel_id, guild_id, parent_id, permission_overwrites, type,
// 				name, raw_position, deleted, rtc_region, bitrate, user_limit)
// 				VALUES ($1, $2, $3, COALESCE($4, '{}'::jsonb), $5, $6, $7, COALESCE($8, FALSE), $9, $10, $11)`
// 			_, err := db.Exec(query, channel.ChannelID, channel.GuildID, channel.ParentID, channel.PermissionOverwrites, channel.Type, channel.Name, channel.RawPosition, channel.Deleted, channel.RTCRegion, channel.Bitrate, channel.UserLimit)
// 			if err != nil {
// 				return fmt.Errorf("Error adding channel - GUILD_VOICE: %w", err)
// 			}

// 		default:
// 			return fmt.Errorf("Unknown channel type: %s", channel.Type)
// 		}
// 		logger.LogMessage("info", "Added channel ID: %s", channel.ChannelID)

// 	}

// 	return nil
// }

// func UpdateChannel(channel discord.Channel) error {
// 	db := db.GetSQL()
// 	_, err := db.Exec(`UPDATE discord_channels SET permission_overwrites = COALESCE($1, '{}'::jsonb),
// 		type = $2, name = $3, raw_position = $4, deleted = $5,
// 		nsfw = $6, topic = $7, last_message_id = $8, rate_limit_per_user = $9
// 		WHERE discord_channel_id = $10`, channel.PermissionOverwrites, channel.Type, channel.Name, channel.RawPosition, channel.Deleted, channel.NSFW, channel.Topic, channel.LastMessageID, channel.RateLimitPerUser, channel.ChannelID)
// 	if err != nil {
// 		return fmt.Errorf("Error updating channel: %w", err)
// 	}

// 	return nil
// }

// func DeleteChannel(guildID, channelID string) error {
// 	db := db.GetSQL()
// 	_, err := db.Exec(`DELETE FROM discord_channels WHERE guild_id = $1 AND discord_channel_id = $2`, guildID, channelID)
// 	if err != nil {
// 		return fmt.Errorf("Error deleting channel: %w", err)
// 	}

// 	return nil
// }
