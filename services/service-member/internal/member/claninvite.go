package member

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
)

// CreateClanInvite creates a new invite for a clan
func CreateClanInvite(clanInvite member.ClanInvite) (int, error) {
	db := db.GetSQL()
	var inviteID int
	err := db.QueryRow(`INSERT INTO clan_invites (clan_id, sender_id, invite_code, receiver_id, status) VALUES ($1::uuid, $2::uuid, $3, $4::uuid, $5) RETURNING id`, clanInvite.ClanID, clanInvite.SenderID, clanInvite.InviteCode, clanInvite.ReceiverID, clanInvite.Status).Scan(&inviteID)
	if err != nil {
		return inviteID, fmt.Errorf("error inserting clan invite: %w", err)
	}

	logger.LogMessage("info", "Added clan invite for clan ID: %s", clanInvite.ClanID)
	return inviteID, nil
}

// UpdateClanInvite updates a clan invite
func UpdateClanInvite(clanInvite member.ClanInvite) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE clan_invites SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE clan_id = $1::uuid AND invite_code = $3`, clanInvite.ClanID, clanInvite.Status, clanInvite.InviteCode)
	if err != nil {
		return fmt.Errorf("error updating clan invite: %w", err)
	}

	logger.LogMessage("info", "Updated clan invite for clan ID: %s", clanInvite.ClanID)
	return nil
}

// ListClanInvites lists all invites for a clan
func ListClanInvites(clanID string) ([]member.ClanInvite, error) {
	db := db.GetSQL()
	var clanInvites []member.ClanInvite
	rows, err := db.Query(`SELECT ci.id, ci.clan_id, ci.sender_id, ci.invite_code, ci.receiver_id, ci.status, ci.created_at, ci.updated_at
		FROM clan_invites ci
		WHERE ci.clan_id = $1::uuid
		ORDER BY created_at DESC`, clanID)
	if err != nil {
		return clanInvites, fmt.Errorf("error listing clan invites: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var clanInvite member.ClanInvite
		err := rows.Scan(&clanInvite.ID, &clanInvite.ClanID, &clanInvite.SenderID, &clanInvite.InviteCode, &clanInvite.ReceiverID, &clanInvite.Status, &clanInvite.CreatedAt, &clanInvite.UpdatedAt)
		if err != nil {
			return clanInvites, fmt.Errorf("error scanning clan invite: %w", err)
		}
		clanInvites = append(clanInvites, clanInvite)
	}
	if err := rows.Err(); err != nil {
		return clanInvites, fmt.Errorf("error iterating clan invites: %w", err)
	}

	return clanInvites, nil
}

// GetClanInviteByReceiverID gets a clan invite by receiver ID
func GetClanInviteByReceiverID(receiverID string) ([]member.ClanInvite, error) {
	db := db.GetSQL()
	var clanInvites []member.ClanInvite
	rows, err := db.Query(`SELECT ci.id, ci.clan_id, ci.sender_id, ci.invite_code, ci.receiver_id, ci.status, ci.created_at, ci.updated_at
		FROM clan_invites ci
		WHERE ci.receiver_id = $1::uuid
		ORDER BY created_at DESC`, receiverID)
	if err != nil {
		return clanInvites, fmt.Errorf("error listing clan invites: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var clanInvite member.ClanInvite
		err := rows.Scan(&clanInvite.ID, &clanInvite.ClanID, &clanInvite.SenderID, &clanInvite.InviteCode, &clanInvite.ReceiverID, &clanInvite.Status, &clanInvite.CreatedAt, &clanInvite.UpdatedAt)
		if err != nil {
			return clanInvites, fmt.Errorf("error scanning clan invite: %w", err)
		}
		clanInvites = append(clanInvites, clanInvite)
	}
	if err := rows.Err(); err != nil {
		return clanInvites, fmt.Errorf("error iterating clan invites: %w", err)
	}

	return clanInvites, nil
}

// DeleteClanInvite deletes a clan invite
func DeleteClanInvite(id int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM clan_invites WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("error deleting clan invite: %w", err)
	}

	logger.LogMessage("info", "Deleted clan invite: %d", id)
	return nil
}
