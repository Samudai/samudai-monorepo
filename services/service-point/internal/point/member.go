package point

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-point/pkg/point"
	"github.com/lib/pq"
)

func Create(params point.Member) (string, error) {
	db := db.GetSQL()
	var memberID string
	err := db.QueryRow(`INSERT INTO members (email, wallet_address, chain_id) VALUES ($1, $2, $3) RETURNING member_id`, params.Email, params.WalletAddress, params.ChainID).Scan(&memberID)
	if err != nil {
		return memberID, fmt.Errorf("error inserting member: %w", err)
	}

	logger.LogMessage("info", "Added member ID: %s", memberID)
	return memberID, nil
}

func UpdateMember(member point.Member) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET name = $2, email = $3, updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member.MemberID, member.Name, member.Email)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member.MemberID)
	return nil
}

func ListPointMembers(pointID string, limit, offset *int) ([]point.MemberView, error) {
	db := db.GetSQL()
	var members []point.MemberView
	rows, err := db.Query(`SELECT point_id, member_id, access, roles, member_joined, member
		FROM member_points_view WHERE point_id = $1::uuid
		LIMIT $2 OFFSET $3`, pointID, limit, offset)
	if err != nil {
		return members, err
	}

	defer rows.Close()

	for rows.Next() {
		var member point.MemberView
		var rolesJSON, memberJSON *json.RawMessage
		err := rows.Scan(&member.PointID, &member.MemberID, pq.Array(&member.Access),
			&rolesJSON, &member.MemberJoinedAt, &memberJSON)
		if err != nil {
			return members, err
		}
		if rolesJSON != nil {
			err = json.Unmarshal(*rolesJSON, &member.Roles)
			if err != nil {
				return members, err
			}
		}
		if memberJSON != nil {
			err = json.Unmarshal(*memberJSON, &member.Member)
			if err != nil {
				return members, err
			}
		}
		members = append(members, member)
	}

	return members, nil
}

func FetchMember(params point.FetchMemberParams) (point.Member, error) {
	db := db.GetSQL()
	var Member point.Member
	fields := `m.member_id, m.name, m.email, m.chain_id, m.wallet_address, m.email_verified, m.is_onboarded, m.created_at FROM members m`
	var query string
	var row *sql.Row
	if params.Type == point.FetchMemberTypeMemberID {
		query = `SELECT ` + fields + ` WHERE m.member_id = $1::uuid`
		row = db.QueryRow(query, params.MemberID)
	} else if params.Type == point.FetchMemberTypeDiscord {
		query = `SELECT ` + fields + ` LEFT JOIN discord d ON d.member_id = m.member_id WHERE d.discord_user_id = $1`
		row = db.QueryRow(query, params.DiscordUserID)
	} else if params.Type == point.FetchMemberTypeWallet {
		query = `SELECT ` + fields + ` WHERE m.wallet_address = $1`
		row = db.QueryRow(query, params.WalletAddress)
	}
	err := row.Scan(&Member.MemberID, &Member.Name, &Member.Email, &Member.ChainID, &Member.WalletAddress, &Member.EmailVerified,
		&Member.IsOnboarded, &Member.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return Member, fmt.Errorf("member not found")
		}
		return Member, fmt.Errorf("error getting member: %w", err)
	}

	return Member, nil
}

func FetchMemberIdByDiscord(DiscordUserIds []string) ([]string, error) {
	db := db.GetSQL()

	memberIDMap := make(map[string]string, len(DiscordUserIds))
	for _, id := range DiscordUserIds {
		memberIDMap[id] = ""
	}

	query := `SELECT d.discord_user_id, m.member_id FROM members m LEFT JOIN discord d ON d.member_id = m.member_id WHERE d.discord_user_id = ANY($1::text[])`
	rows, err := db.Query(query, pq.Array(DiscordUserIds))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var discordUserId, memberID string
		err := rows.Scan(&discordUserId, &memberID)
		if err != nil {
			return nil, err
		}
		memberIDMap[discordUserId] = memberID
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	var memberIDs []string
	for _, id := range DiscordUserIds {
		memberIDs = append(memberIDs, memberIDMap[id])
	}

	return memberIDs, nil
}

func UpdateMemberWalletAddress(member point.Member) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET wallet_address = $2, chain_id = $3, updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member.MemberID, member.WalletAddress, member.ChainID)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member.MemberID)
	return nil
}

func UpdateMemberEmailName(member_id string, email *string, name *string, emailVerified bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET email = $2, name = $3, email_verified = $4, updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member_id, email, name, emailVerified)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member_id)
	return nil
}

func UpdateEmailVerificationCode(member_id string, email_verification_code *string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET email_verification_code = $2, updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member_id, email_verification_code)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member_id)
	return nil
}

func UpdateIsOnboarded(member_id string, is_onboarded bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET is_onboarded = $2, updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member_id, is_onboarded)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member_id)
	return nil
}

func VerifyEmailForMember(member_id string, email_verification_code string) error {
	db := db.GetSQL()

	result, err := db.Exec(`UPDATE members 
                            SET email_verified = true, updated_at = CURRENT_TIMESTAMP 
                            WHERE member_id = $1::uuid AND email_verification_code = $2`,
		member_id, email_verification_code)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("Verification code does not match")
	}

	logger.LogMessage("info", "Email verified for member ID: %s", member_id)
	return nil
}

func CreateDAOMembersDiscord(members []point.PointMember) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, member := range members {
		_, err = tx.Exec(`INSERT INTO member_points (point_id, member_id, created_at, points) 
			VALUES ($1::uuid, $2::uuid, $3, $4) ON CONFLICT (point_id, member_id)
			DO UPDATE SET points = points + $4`,
			member.PointID, member.MemberID, member.CreatedAt, member.Points)
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

func UpdateSQLPoints(members []point.PointMember) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, member := range members {
		_, err = tx.Exec(`INSERT INTO member_points (point_id, member_id, created_at, points) 
			VALUES ($1::uuid, $2::uuid, $3, $4) ON CONFLICT (point_id, member_id)
			DO UPDATE SET points = $4`,
			member.PointID, member.MemberID, member.CreatedAt, member.Points)
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
