package point

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func CreatePoint(Point point.Point) (string, error) {
	db := db.GetSQL()
	var pointID string
	var err = db.QueryRow(`INSERT INTO point (name, guild_id, email) 
		VALUES ($1, $2, $3) RETURNING point_id`,
		Point.Name, Point.GuildID, Point.Email).Scan(&pointID)
	if err != nil {
		return pointID, err
	}

	logger.LogMessage("info", "Added POINT ID: %s", pointID)
	return pointID, nil
}
func UpdatePointsNum(memberID string, pointID string, pointsNum float64) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE member_points SET points = points + $1 WHERE member_id =$2::uuid AND point_id = $3::uuid`,
		pointsNum, memberID, pointID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Added POINT ID: %s", pointID)
	return nil
}

func UpdateGuildId(pointID string, guildID string, serverName string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE point SET guild_id = $1, server_name = $3, updated_at = CURRENT_TIMESTAMP WHERE point_id = $2::uuid`,
		guildID, pointID, serverName)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", pointID)
	return nil
}

func GetPointByMemberID(memberID string) ([]point.MemberPoint, error) {
	db := db.GetSQL()
	var points []point.MemberPoint
	rows, err := db.Query(`SELECT mv.id, mv.member_id, mv.point_id, mv.name, mv.guild_id,
        mv.roles, mv.access, mv.point_created, mv.point_updated, mv.member_joined ,mv.points, mv.server_name
		FROM member_points_view mv
		WHERE mv.member_id = $1::uuid
		ORDER BY point_created DESC`, memberID)
	if err != nil {
		return points, err
	}
	defer rows.Close()
	for rows.Next() {
		var Point point.MemberPoint
		var rolesJSON *json.RawMessage
		err := rows.Scan(&Point.ID, &Point.MemberID, &Point.PointID, &Point.Name, &Point.GuildID,
			&rolesJSON, pq.Array(&Point.Access), &Point.PointCreatedAt,
			&Point.PointUpdatedAt, &Point.MemberJoinedAt, &Point.Points, &Point.ServerName)
		if err != nil {
			return points, err
		}

		err = json.Unmarshal(*rolesJSON, &Point.Roles)
		if err != nil {
			return points, err
		}

		points = append(points, Point)
	}

	return points, nil
}

func GetPointIDByGuildID(guilds string) (string, error) {
	db := db.GetSQL()
	var point string
	err := db.QueryRow(`SELECT point_id FROM point WHERE guild_id = $1`, guilds).Scan(&point)
	if err != nil {
		return point, err
	}

	return point, nil
}
func GetPointByGuildID(guilds string) (*point.Point, error) {
	db := db.GetSQL()
	var point point.Point
	err := db.QueryRow(`SELECT point_id,name,guild_id,email FROM point WHERE guild_id = $1`, guilds).Scan(&point.PointID, &point.Name, &point.GuildID, &point.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &point, nil
}
func GetGuildByPointID(pointID string) (string, error) {
	db := db.GetSQL()
	var point string
	err := db.QueryRow(`SELECT guild_id FROM point WHERE point_id = $1`, pointID).Scan(&point)
	if err != nil {
		return point, err
	}

	return point, nil
}

func GetPointByPointID(pointID string) (point.PointView, error) {
	db := db.GetSQL()
	var point point.PointView
	err := db.QueryRow(`SELECT id,point_id,name,guild_id,email,server_name FROM point WHERE point_id = $1`,
		pointID).Scan(&point.ID, &point.PointID, &point.Name, &point.GuildID, &point.Email, &point.ServerName)
	if err != nil {
		return point, err
	}

	return point, nil
}
func GetPointIdsByMemberId(memberID string) ([]string, error) {
	db := db.GetSQL()
	var pointIds []string
	rows, err := db.Query(`SELECT point_id FROM member_points WHERE member_id = $1`, memberID)
	if err != nil {
		return nil, fmt.Errorf("failed to query member points: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var pointId string
		if err := rows.Scan(&pointId); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		pointIds = append(pointIds, pointId)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return pointIds, nil
}
