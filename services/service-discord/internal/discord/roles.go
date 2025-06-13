package discord

import (
	"context"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-discord/pkg/discord"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// AddRoles adds roles to the database
func AddRoles(guildID string, roles []discord.Role) error {
	db := db.GetMongo()

	data := make([]interface{}, len(roles))
	for i, role := range roles {
		data[i] = role
	}

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionRoles).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	return nil
}

type Role struct {
	RoleID string `json:"id" bson:"_id"`
	Name   string `json:"name" bson:"name"`
}

func GetRolesByGuildID(guildID string) ([]Role, error) {
	db := db.GetMongo()

	cursor, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionRoles).Find(context.Background(), bson.M{"guild_id": guildID}, &options.FindOptions{Projection: bson.M{"_id": 1, "name": 1}})
	if err != nil {
		return nil, err
	}

	var roles []Role
	if err = cursor.All(context.Background(), &roles); err != nil {
		return nil, err
	}

	return roles, nil
}

func UpdateRole(guildID string, role discord.Role) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionRoles).UpdateOne(context.Background(), bson.M{"_id": role.RoleID, "guild_id": guildID}, bson.M{"$set": role})
	if err != nil {
		return err
	}

	return nil
}

func DeleteRole(guildID, roleID string) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabaseDiscord).Collection(discord.CollectionRoles).DeleteOne(context.Background(), bson.M{"_id": roleID, "guild_id": guildID})
	if err != nil {
		return err
	}

	return nil
}

// Point

// AddRoles adds roles to the database
func AddRolesPoint(guildID string, roles []discord.Role) error {
	db := db.GetMongo()

	data := make([]interface{}, len(roles))
	for i, role := range roles {
		data[i] = role
	}

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionRoles).InsertMany(context.Background(), data)
	if err != nil {
		return err
	}

	return nil
}

func GetRolesByGuildIDPoint(guildID string) ([]Role, error) {
	db := db.GetMongo()

	cursor, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionRoles).Find(context.Background(), bson.M{"guild_id": guildID}, &options.FindOptions{Projection: bson.M{"_id": 1, "name": 1}})
	if err != nil {
		return nil, err
	}

	var roles []Role
	if err = cursor.All(context.Background(), &roles); err != nil {
		return nil, err
	}

	return roles, nil
}

func UpdateRolePoint(guildID string, role discord.Role) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionRoles).UpdateOne(context.Background(), bson.M{"_id": role.RoleID, "guild_id": guildID}, bson.M{"$set": role})
	if err != nil {
		return err
	}

	return nil
}

func DeleteRolePoint(guildID, roleID string) error {
	db := db.GetMongo()

	_, err := db.Database(discord.DatabasePointDiscord).Collection(discord.CollectionRoles).DeleteOne(context.Background(), bson.M{"_id": roleID, "guild_id": guildID})
	if err != nil {
		return err
	}

	return nil
}
