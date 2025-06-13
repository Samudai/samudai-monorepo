package member

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateClan(clan member.Clan) (string, error) {
	db := db.GetSQL()
	var clanID string
	err := db.QueryRow(`INSERT INTO clans (name, visibility, avatar, created_by)
		VALUES ($1, $2, $3, $4) RETURNING clan_id`, clan.Name, clan.Visibility, clan.Avatar, clan.CreatedBy).Scan(&clanID)
	if err != nil {
		return clanID, fmt.Errorf("error inserting clan: %w", err)
	}

	logger.LogMessage("info", "Added clan ID: %s", clanID)

	return clanID, nil
}

func AddClanMember(clanMember member.ClanMember) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO clan_members (clan_id, member_id, role, notification) VALUES ($1::uuid, $2::uuid, $3, $4)`, clanMember.ClanID, clanMember.MemberID, clanMember.Role, clanMember.Notification)
	if err != nil {
		return fmt.Errorf("error inserting clan member: %w", err)
	}

	logger.LogMessage("info", "Added clan member for clan ID: %s", clanMember.ClanID)
	return nil
}

func GetClanByID(clanID string) (member.ClanView, error) {
	db := db.GetSQL()
	var clan member.ClanView
	var clanMembersJSON *json.RawMessage
	err := db.QueryRow(`SELECT cv.clan_id, cv.name, cv.visibility, cv.avatar, cv.created_by, 
		cv.created_at, cv.updated_at, cv.members
		FROM clan_view cv
		WHERE cv.clan_id = $1::uuid`, clanID).Scan(&clan.ClanID, &clan.Name, &clan.Visibility, &clan.Avatar, &clan.CreatedBy,
		&clan.CreatedAt, &clan.UpdatedAt, &clanMembersJSON)
	if err != nil {
		return clan, fmt.Errorf("error fetching clan: %w", err)
	}
	if clanMembersJSON != nil {
		err = json.Unmarshal([]byte(*clanMembersJSON), &clan.Members)
		if err != nil {
			return clan, fmt.Errorf("error unmarshalling clan members: %w", err)
		}
	}

	logger.LogMessage("info", "Got clan ID: %s", clanID)
	return clan, nil
}

func GetClanByMemberID(memberID string) ([]member.ClanView, error) {
	db := db.GetSQL()
	var clans []member.ClanView
	rows, err := db.Query(`SELECT cv.clan_id, cv.name, cv.visibility, cv.avatar, cv.created_by, 
		cv.created_at, cv.updated_at, cv.members
		FROM clan_view cv
		JOIN clan_members cm ON cm.clan_id = cv.clan_id
		WHERE cm.member_id = $1::uuid`, memberID)
	if err != nil {
		return clans, fmt.Errorf("error querying clan: %w", err)
	}

	defer rows.Close()
	
	for rows.Next() {
		var clan member.ClanView
		var clanMembersJSON *json.RawMessage
		err = rows.Scan(&clan.ClanID, &clan.Name, &clan.Visibility, &clan.Avatar, &clan.CreatedBy,
			&clan.CreatedAt, &clan.UpdatedAt, &clanMembersJSON)
		if err != nil {
			return clans, fmt.Errorf("error scanning clan: %w", err)
		}

		if clanMembersJSON != nil {
			err = json.Unmarshal([]byte(*clanMembersJSON), &clan.Members)
			if err != nil {
				return clans, fmt.Errorf("error unmarshalling clan members: %w", err)
			}
		}

		clans = append(clans, clan)
	}

	logger.LogMessage("info", "Got clans for member ID: %s", memberID)
	return clans, nil
}

func UpdateClan(clan member.Clan) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE clans SET name = $2, visibility = $3, avatar = $4, updated_at = CURRENT_TIMESTAMP WHERE clan_id = $1::uuid`, clan.ClanID, clan.Name, clan.Visibility, clan.Avatar)
	if err != nil {
		return fmt.Errorf("error updating clan: %w", err)
	}

	logger.LogMessage("info", "Updated clan ID: %s", clan.ClanID)
	return nil
}

func DeleteClan(clanID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM clans WHERE clan_id = $1::uuid`, clanID)
	if err != nil {
		return fmt.Errorf("error deleting clan: %w", err)
	}

	logger.LogMessage("info", "Deleted clan ID: %s", clanID)
	return nil
}

func RemoveClanMember(clanID string, memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM clan_members WHERE clan_id = $1::uuid AND member_id = $2::uuid`, clanID, memberID)
	if err != nil {
		return fmt.Errorf("error deleting clan member: %w", err)
	}

	logger.LogMessage("info", "Deleted clan member for clan ID: %s", clanID)
	return nil
}
