package dao

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/lib/pq"
)

func CreateDAOMember(member dao.Member) error {
	db := db.GetSQL()
	var memberID string
	_, err := db.Exec(`INSERT INTO members (dao_id, member_id) 
		VALUES ($1::uuid, $2::uuid) 
		ON CONFLICT (dao_id, member_id) DO NOTHING`,
		member.DAOID, member.MemberID)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	logger.LogMessage("info", "Added DAO member ID: %s to DAO ID: %s", memberID, member.DAOID)

	return nil
}

func CreateDAOMemberDiscord(member dao.Member) error {
	db := db.GetSQL()
	_, err := db.Exec(`
		INSERT INTO members (dao_id, member_id, created_at) 
		VALUES ($1::uuid, $2::uuid, $3) 
		ON CONFLICT (dao_id, member_id) DO NOTHING`,
		member.DAOID, member.MemberID, member.CreatedAt)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	logger.LogMessage("info", "Added DAO member ID: %s to DAO ID: %s", member.MemberID, member.DAOID)

	return nil
}

func CreateDAOMembers(members []dao.Member) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, member := range members {
		_, err = tx.Exec(`INSERT INTO members (dao_id, member_id) VALUES ($1::uuid, $2::uuid) ON CONFLICT (dao_id, member_id) DO NOTHING`, member.DAOID, member.MemberID)
		if err != nil && err != sql.ErrNoRows {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func CreateDAOMembersDiscord(members []dao.Member) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, member := range members {
		_, err = tx.Exec(`INSERT INTO members (dao_id, member_id, created_at) 
			VALUES ($1::uuid, $2::uuid, $3) ON CONFLICT (dao_id, member_id) DO NOTHING`,
			member.DAOID, member.MemberID, member.CreatedAt)
		if err != nil && err != sql.ErrNoRows {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func ListDAOMembers(daoID string, limit, offset *int) ([]dao.MemberDAO, error) {
	db := db.GetSQL()
	var members []dao.MemberDAO
	rows, err := db.Query(`SELECT dao_id, member_id, access, roles, member_joined 
		FROM members_view WHERE dao_id = $1::uuid
		LIMIT $2 OFFSET $3`, daoID, limit, offset)
	if err != nil {
		return members, err
	}

	defer rows.Close()

	for rows.Next() {
		var member dao.MemberDAO
		var rolesJSON *json.RawMessage
		err := rows.Scan(&member.DAOID, &member.MemberID, pq.Array(&member.Access), &rolesJSON, &member.MemberJoinedAt)
		if err != nil {
			return members, err
		}
		if rolesJSON != nil {
			err = json.Unmarshal(*rolesJSON, &member.Roles)
			if err != nil {
				return members, err
			}
		}
		members = append(members, member)
	}

	return members, nil
}

func GetMembersForDAO(daoId string) ([]dao.DAOMemberResponse, error) {
	db := db.GetSQL()
	var members []dao.DAOMemberResponse

	rows, err := db.Query(`SELECT member_id, licensed_member
		FROM members WHERE dao_id = $1::uuid`, daoId)
	if err != nil {
		return members, err
	}

	defer rows.Close()

	for rows.Next() {
		var member dao.DAOMemberResponse
		err := rows.Scan(&member.MemberID, &member.LicensedMember)
		if err != nil {
			return members, err
		}
		members = append(members, member)
	}

	return members, nil
}

func ListDAOMembersUUID(daoID string) ([]string, error) {
	db := db.GetSQL()
	var members []string
	rows, err := db.Query(`SELECT member_id FROM members WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return members, err
	}

	defer rows.Close()

	for rows.Next() {
		var member string
		err := rows.Scan(&member)
		if err != nil {
			return members, err
		}
		members = append(members, member)
	}

	return members, nil
}

func DeleteDAOMember(daoID, memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM members WHERE dao_id = $1::uuid AND member_id = $2::uuid`, daoID, memberID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO member ID: %s from DAO ID: %s", memberID, daoID)

	return nil
}

func MapDiscord(memberId string, guilds []dao.GuildInfo) error {
	var memberroles []dao.MemberRoleDiscord
	for _, guild := range guilds {
		daoID, err := getDaoIDForGuild(guild.GuildID)
		if err != nil {
			logger.LogMessage("error", "Error getting DAO ID for guild ID: %s", guild.GuildID)
			continue
		}

		if daoID == "" {
			continue
		}

		member := dao.Member{
			DAOID:     daoID,
			MemberID:  memberId,
			CreatedAt: guild.JoinedAt,
		}

		err = CreateDAOMemberDiscord(member)
		if err != nil {
			fmt.Println("error creating dao member")
			return err
		}

		logger.LogMessage("info", "Mapped Discord member ID: %s to DAO ID: %s", memberId, daoID)

		memberrole := dao.MemberRoleDiscord{
			DAOID:          daoID,
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

func UpdateDAOMemberLicense(daoID, memberID string, licensed_member bool) error {
	db := db.GetSQL()

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	if licensed_member {
		var Count int
		var DaoSubscriptionResponse dao.DaoSubscriptionResponse
		var DaoSubscriptionResponseJSON *json.RawMessage

		err := db.QueryRow(`SELECT COUNT(*) FROM members m WHERE dao_id = $1 AND licensed_member = true`, daoID).Scan(&Count)
		if err != nil {
			return err
		}

		err = db.QueryRow(`SELECT subscription FROM dao_view WHERE dao_id = $1`, daoID).Scan(&DaoSubscriptionResponseJSON)
		if err != nil {
			return err
		}

		if DaoSubscriptionResponseJSON != nil {
			err = json.Unmarshal(*DaoSubscriptionResponseJSON, &DaoSubscriptionResponse)
			if err != nil {
				return err
			}
		}

		if DaoSubscriptionResponse.CurrentPlan.User <= Count {
			return fmt.Errorf("maximum number of licensed members reached")
		}
	}

	_, err = tx.Exec(`UPDATE members SET licensed_member = $3 WHERE dao_id = $1 AND member_id = $2`, daoID, memberID, licensed_member)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func UpdateDAOMemberLicenseBulk(daoID string, memberIDs []string, licensed_member bool) error {
	db := db.GetSQL()
	
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()
	
	if licensed_member {
		var Count int
		var DaoSubscriptionResponse dao.DaoSubscriptionResponse
		var DaoSubscriptionResponseJSON *json.RawMessage
		
		err := db.QueryRow(`SELECT COUNT(*) FROM members m WHERE dao_id = $1 AND licensed_member = true`, daoID).Scan(&Count)
		if err != nil {
			return err
		}
		
		err = db.QueryRow(`SELECT subscription FROM dao_view WHERE dao_id = $1`, daoID).Scan(&DaoSubscriptionResponseJSON)
		if err != nil {
			return err
		}
		
		if DaoSubscriptionResponseJSON != nil {
			err = json.Unmarshal(*DaoSubscriptionResponseJSON, &DaoSubscriptionResponse)
			if err != nil {
				return err
			}
		}
		
		if DaoSubscriptionResponse.CurrentPlan.User < Count + len(memberIDs) {
			return fmt.Errorf("Adding users more than the available licenses")
		}
	}
	
	for _, memberID := range memberIDs {
		_, err := tx.Exec(`UPDATE members SET licensed_member = $3 WHERE dao_id = $1 AND member_id = $2`, daoID, memberID, licensed_member)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func GetLicensedMemberCount(daoId string) (int, error) {
	db := db.GetSQL()

	var Count int
	err := db.QueryRow(`SELECT COUNT(*) FROM members m WHERE dao_id = $1 AND licensed_member = true`, daoId).Scan(&Count)
	if err != nil {
		return Count, err
	}

	return Count, nil
}
