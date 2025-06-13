package member

import (
	"database/sql"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
	"github.com/lib/pq"
)

func CreateConnection(connection member.ConnectionRequest) error {
	db := db.GetSQL()
	_, err := db.Exec(`INSERT INTO connection_request (sender_id, receiver_id, status, message) VALUES ($1::uuid, $2::uuid, $3, $4)`, connection.SenderID, connection.ReceiverID, connection.Status, connection.Message)
	if err != nil {
		return err
	}

	return nil
}

func ListConnectionsBySenderID(senderID string) ([]member.Connection, error) {
	db := db.GetSQL()
	var connections []member.Connection

	rows, err := db.Query(`SELECT c.id, c.sender_id, c.receiver_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.receiver_id = m.member_id 
		WHERE c.sender_id = $1::uuid`, senderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var conn member.Connection
		err := rows.Scan(&conn.ID, &conn.ReceiverID, &conn.MemberID, &conn.Status, &conn.CreatedAt, &conn.UpdatedAt, &conn.Message,
			&conn.Name, &conn.Username, &conn.ProfilePicture, &conn.About,
			&conn.DID, pq.Array(&conn.Skills), &conn.Captain, &conn.OpenForOpportunity)
		if err != nil {
			return nil, err
		}
		connections = append(connections, conn)
	}
	return connections, nil
}

func ListConnectionsByReceiverID(senderID string) ([]member.Connection, error) {
	db := db.GetSQL()
	var connections []member.Connection

	rows, err := db.Query(`SELECT c.id, c.receiver_id, c.sender_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.sender_id = m.member_id 
		WHERE c.receiver_id = $1::uuid
		AND status = 'pending'`, senderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var conn member.Connection
		err := rows.Scan(&conn.ID, &conn.SenderID, &conn.MemberID, &conn.Status, &conn.CreatedAt, &conn.UpdatedAt, &conn.Message,
			&conn.Name, &conn.Username, &conn.ProfilePicture, &conn.About,
			&conn.DID, pq.Array(&conn.Skills), &conn.Captain, &conn.OpenForOpportunity)
		if err != nil {
			return nil, err
		}
		connections = append(connections, conn)
	}
	return connections, nil
}

func UpdateConnection(connection member.ConnectionRequest) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE connection_request SET message = $4, status = $3, updated_at = CURRENT_TIMESTAMP WHERE sender_id = $1::uuid AND receiver_id = $2::uuid`, connection.SenderID, connection.ReceiverID, connection.Status, connection.Message)
	if err != nil {
		return err
	}
	return nil
}

func DeleteConnection(senderID string, receiverID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM connection_request WHERE sender_id = $1::uuid AND receiver_id = $2::uuid`, senderID, receiverID)
	if err != nil {
		return err
	}
	return nil
}

func ListConnectionsForMember(memberID string) ([]member.Connection, error) {
	db := db.GetSQL()
	var connections []member.Connection
	rows, err := db.Query(`SELECT c.receiver_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.receiver_id = m.member_id 
		WHERE c.sender_id = $1::uuid AND c.status = $2
		UNION
		SELECT c.sender_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.sender_id = m.member_id 
		WHERE c.receiver_id = $1::uuid AND c.status = $2`, memberID, member.InviteStatusAccepted)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var connection member.Connection
		err := rows.Scan(&connection.MemberID, &connection.Status, &connection.CreatedAt, &connection.UpdatedAt, &connection.Message,
			&connection.Name, &connection.Username, &connection.ProfilePicture, &connection.About,
			&connection.DID, pq.Array(&connection.Skills), &connection.Captain, &connection.OpenForOpportunity)
		if err != nil {
			return nil, err
		}
		connections = append(connections, connection)
	}
	return connections, nil
}

func ListAllConnectionsForMember(memberID string) ([]member.Connection, error) {
	db := db.GetSQL()
	var connections []member.Connection
	rows, err := db.Query(`SELECT c.receiver_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.receiver_id = m.member_id 
		WHERE c.sender_id = $1::uuid
		UNION
		SELECT c.sender_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, ''),
		m.name, m.username, m.profile_picture, m.about, 
		m.did, m.skills, m.captain, m.open_for_opportunity
		FROM connection_request c 
		JOIN members m ON c.sender_id = m.member_id 
		WHERE c.receiver_id = $1::uuid`, memberID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var connection member.Connection
		err := rows.Scan(&connection.MemberID, &connection.Status, &connection.CreatedAt, &connection.UpdatedAt, &connection.Message,
			&connection.Name, &connection.Username, &connection.ProfilePicture, &connection.About,
			&connection.DID, pq.Array(&connection.Skills), &connection.Captain, &connection.OpenForOpportunity)
		if err != nil {
			return nil, err
		}
		connections = append(connections, connection)
	}
	return connections, nil
}

func GetConnectionStatus(viewerID string, memebrID string) (*member.ConnectionRequest, error) {
	db := db.GetSQL()
	var status member.ConnectionRequest
	err := db.QueryRow(`SELECT c.id, c.sender_id, c.receiver_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, '') 
		FROM connection_request c 
		WHERE c.sender_id = $1::uuid AND c.receiver_id = $2
		UNION
		SELECT c.id, c.sender_id, c.receiver_id, c.status, c.created_at, c.updated_at, COALESCE(c.message, '') 
		FROM connection_request c 
		WHERE c.receiver_id = $1::uuid AND c.sender_id = $2`, viewerID, memebrID).Scan(&status.ID, &status.SenderID, &status.ReceiverID, &status.Status, &status.CreatedAt, &status.UpdatedAt, &status.Message)
	if err != nil {
		if err != sql.ErrNoRows {
			return nil, err
		}
		return nil, nil
	}

	return &status, nil
}

func ConnectionExist(member1 string, member2 string) (bool , error) {
	db := db.GetSQL()
	var exist bool

	err := db.QueryRow(`
		SELECT EXISTS (
			SELECT 1 FROM connection_request
			WHERE (sender_id = $1::uuid AND receiver_id = $2::uuid)
			OR (sender_id = $2::uuid AND receiver_id = $1::uuid)
		) AS connection_exists;
	`, member1, member2).Scan(&exist)

	if err != nil {
		return exist, err
	}

	return exist, err
}