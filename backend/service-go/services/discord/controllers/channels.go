package controllers

// // AddChannelsParams is the params for adding channels to a discord guild
// type AddChannelsParams struct {
// 	Channels []pkg.Channel `json:"channels"`
// }

// // Addchannels adds channels to a discord guild
// func Addchannels(c *gin.Context) {
// 	var params AddChannelsParams
// 	if err := c.ShouldBindJSON(&params); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	err := discord.Addchannels(params.Channels)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

// type UpdateChannelParams struct {
// 	Channel pkg.Channel `json:"channel"`
// }

// func UpdateChannel(c *gin.Context) {
// 	var params UpdateChannelParams
// 	if err := c.ShouldBindJSON(&params); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	err := discord.UpdateChannel(params.Channel)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }

// func DeleteChannel(c *gin.Context) {
// 	guildID := c.Param("guild_id")
// 	channelID := c.Param("channel_id")

// 	err := discord.DeleteChannel(guildID, channelID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "success"})
// }
