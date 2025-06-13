package point

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
)

func CreatePointMember(member point.PointMember) error {
	db := db.GetSQL()
	_, err := db.Exec(`
		INSERT INTO member_points (point_id, member_id, points) 
		VALUES ($1::uuid, $2::uuid, $3) 
		ON CONFLICT (point_id, member_id) DO NOTHING`,
		member.PointID, member.MemberID, member.Points)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	logger.LogMessage("info", "Added Member Point ID: %s to Point ID: %s", member.MemberID, member.PointID)

	return nil
}

func MapDiscord(memberId string, guilds []point.GuildInfo) error {
	var memberroles []point.MemberRoleDiscord
	for _, guild := range guilds {
		pointID, err := GetPointIDByGuildID(guild.GuildID)
		if err != nil {
			logger.LogMessage("error", "Error getting Point ID for guild ID: %s", guild.GuildID)
			continue
		}

		if pointID == "" {
			continue
		}

		member := point.PointMember{
			PointID:   pointID,
			MemberID:  memberId,
			Points:    guild.PointsNum,
			CreatedAt: guild.JoinedAt,
		}

		err = CreatePointMember(member)
		if err != nil {
			fmt.Println("error creating memberpoint")
			return err
		}

		logger.LogMessage("info", "Mapped Discord member ID: %s to Point ID: %s", memberId, pointID)

		memberrole := point.MemberRoleDiscord{
			PointID:        pointID,
			MemberID:       memberId,
			DiscordRoleIDs: guild.DiscordRoles,
		}

		memberroles = append(memberroles, memberrole)
	}
	if memberroles == nil {
		return nil
	}

	err := CreateMemberRolesDiscord(memberroles)
	if err != nil {
		fmt.Println("error creating member roles discord")
		return err
	}

	logger.LogMessage("info", "Mapped Discord roles for member ID: %s", memberId)
	return nil
}

func UpdatePointsByDiscordIdAndGuildId(discord_user_id, guild_id string, points int) error {
	db := db.GetSQL()

	// Fetching member_id using discord_user_id
	var memberID string
	err := db.QueryRow(`SELECT member_id FROM discord WHERE discord_user_id = $1`, discord_user_id).Scan(&memberID)
	if err != nil {
		if err == sql.ErrNoRows {
			// Discord user not found, do nothing
			fmt.Println("Error fetching Member ID")
			return nil
		}
		return err
	}

	// Fetching point_id using guild_id
	var pointID string
	err = db.QueryRow(`SELECT point_id FROM point WHERE guild_id = $1`, guild_id).Scan(&pointID)
	if err != nil {
		if err == sql.ErrNoRows {
			// Guild not found, do nothing
			fmt.Println("Error fetching Point ID")
			return nil
		}
		return err
	}

	// If either memberID or pointID is empty, do nothing
	if memberID == "" || pointID == "" {
		return nil
	}

	// Update points using member_id and point_id
	_, err = db.Exec(`UPDATE member_points SET points = points + $1 WHERE point_id = $2::uuid AND member_id = $3::uuid`,
		points, pointID, memberID)
	if err != nil {
		log.Printf("Error Updating points for the member: %s", memberID)
		return err
	}

	logger.LogMessage("info", "Updated Points for PointID: %s", pointID)
	return nil
}

func UpdatePoints(memberID, pointID string, points float64) error {
	db := db.GetSQL()

	result, err := db.Exec(`UPDATE member_points SET points = points + $1 WHERE point_id = $2::uuid AND member_id = $3::uuid`,
		points, pointID, memberID)
	if err != nil {
		log.Printf("Error Updating points for the member: %s", memberID)
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error checking rows affected: %s", err)
		return err
	}
	if rowsAffected == 0 {
		_, err = db.Exec(`INSERT INTO member_points (point_id, member_id, points) 
		VALUES ($1::uuid, $2::uuid, $3) 
		ON CONFLICT (point_id, member_id) DO NOTHING `, pointID, memberID, points)
		if err != nil {
			log.Printf("Error Inserting new points for the member: %s", memberID)
			return err
		}
	}

	logger.LogMessage("info", "Updated Points for PointID: %s", pointID)
	return nil
}
