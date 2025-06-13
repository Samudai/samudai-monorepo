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

func CreateDAO(DAO dao.DAO) (string, error) {
	db := db.GetSQL()
	var daoID string
	var err = db.QueryRow(`INSERT INTO dao (name, about, guild_id, profile_picture, contract_address, owner_id, dao_type, tags, open_to_collaboration, poc_member_id, join_dao_link) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING dao_id`,
		DAO.Name, DAO.About, DAO.GuildID, DAO.ProfilePicture, DAO.ContractAddress, DAO.OwnerID, DAO.DAOType, pq.Array(DAO.Tags), DAO.OpenToCollaboration, DAO.POCMemberID, DAO.JoinDAOLink).Scan(&daoID)
	if err != nil {
		return daoID, err
	}

	logger.LogMessage("info", "Added DAO ID: %s", daoID)
	return daoID, nil
}

func GetDAOByID(daoID string) (dao.DAOView, error) {
	db := db.GetSQL()
	var DAO dao.DAOView
	var socialsJSON, tokensJSON, departmentsJSON, rolesJSON *json.RawMessage
	var pocMemberJSON, membersJSON, collaborationPassJSON, collaborationsJSON *json.RawMessage
	var DaoSubscriptionResponseJSON *json.RawMessage
	err := db.QueryRow(`SELECT dao_id, name, about, guild_id, profile_picture,
		contract_address, snapshot, owner_id, created_at, updated_at,
	    roles, departments, socials, tokens, 
		onboarding, token_gating, dao_type, tags, open_to_collaboration, poc_member, members, 
		members_count, join_dao_link, collaboration_pass, collaborations, subscription, subscription_count
		FROM dao_view dv
		WHERE dao_id = $1::uuid`, daoID).Scan(&DAO.DAOID, &DAO.Name, &DAO.About, &DAO.GuildID, &DAO.ProfilePicture,
		&DAO.ContractAddress, &DAO.Snapshot, &DAO.OwnerID, &DAO.CreatedAt, &DAO.UpdatedAt,
		&rolesJSON, &departmentsJSON, &socialsJSON, &tokensJSON,
		&DAO.Onboarding, &DAO.TokenGating, &DAO.DAOType, pq.Array(&DAO.Tags), &DAO.OpenToCollaboration, &pocMemberJSON,
		&membersJSON, &DAO.MembersCount, &DAO.JoinDAOLink, &collaborationPassJSON, &collaborationsJSON,
		&DaoSubscriptionResponseJSON, &DAO.SubscriptionCount)
	if err != nil {
		return DAO, err
	}

	if departmentsJSON != nil {
		err = json.Unmarshal(*departmentsJSON, &DAO.Departments)
		if err != nil {
			return DAO, err
		}
	}

	if rolesJSON != nil {
		err = json.Unmarshal(*rolesJSON, &DAO.Roles)
		if err != nil {
			return DAO, err
		}
	}

	if socialsJSON != nil {
		err = json.Unmarshal(*socialsJSON, &DAO.Socials)
		if err != nil {
			return DAO, err
		}
	}

	if tokensJSON != nil {
		err = json.Unmarshal(*tokensJSON, &DAO.Tokens)
		if err != nil {
			return DAO, err
		}
	}

	if pocMemberJSON != nil {
		err = json.Unmarshal(*pocMemberJSON, &DAO.POCMember)
		if err != nil {
			return DAO, err
		}
	}

	if membersJSON != nil {
		err = json.Unmarshal(*membersJSON, &DAO.Members)
		if err != nil {
			return DAO, err
		}
	}

	if collaborationPassJSON != nil {
		err = json.Unmarshal(*collaborationPassJSON, &DAO.DaoCollaborationPass)
		if err != nil {
			return DAO, err
		}
	}

	if collaborationsJSON != nil {
		err = json.Unmarshal(*collaborationsJSON, &DAO.Collaborations)
		if err != nil {
			return DAO, err
		}
	}

	if DaoSubscriptionResponseJSON != nil {
		err = json.Unmarshal(*DaoSubscriptionResponseJSON, &DAO.Subscription)
		if err != nil {
			return DAO, err
		}
	}

	return DAO, nil
}

func GetDAOByGuildID(guildID string) (*dao.DAOView, error) {
	db := db.GetSQL()
	var DAO dao.DAOView
	var socialsJSON, tokensJSON, departmentsJSON, rolesJSON *json.RawMessage
	var pocMemberJSON, membersJSON, collaborationPassJSON *json.RawMessage
	var DaoSubscriptionResponseJSON *json.RawMessage
	err := db.QueryRow(`SELECT dao_id, name, about, guild_id, profile_picture,
		contract_address, snapshot, owner_id, created_at, updated_at,
		roles, departments, socials, tokens, 
		onboarding, token_gating, dao_type, tags, open_to_collaboration, poc_member, members, 
		members_count, join_dao_link, collaboration_pass, subscription, subscription_count
		FROM dao_view dv
		WHERE guild_id = $1
		ORDER BY created_at DESC`, guildID).Scan(&DAO.DAOID, &DAO.Name, &DAO.About, &DAO.GuildID, &DAO.ProfilePicture,
		&DAO.ContractAddress, &DAO.Snapshot, &DAO.OwnerID, &DAO.CreatedAt, &DAO.UpdatedAt,
		&rolesJSON, &departmentsJSON, &socialsJSON, &tokensJSON,
		&DAO.Onboarding, &DAO.TokenGating, &DAO.DAOType, pq.Array(&DAO.Tags), &DAO.OpenToCollaboration, &pocMemberJSON,
		&membersJSON, &DAO.MembersCount, &DAO.JoinDAOLink, &collaborationPassJSON, &DaoSubscriptionResponseJSON, &DAO.SubscriptionCount)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	if departmentsJSON != nil {
		err = json.Unmarshal(*departmentsJSON, &DAO.Departments)
		if err != nil {
			return nil, err
		}
	}

	if rolesJSON != nil {
		err = json.Unmarshal(*rolesJSON, &DAO.Roles)
		if err != nil {
			return nil, err
		}
	}

	if socialsJSON != nil {
		err = json.Unmarshal(*socialsJSON, &DAO.Socials)
		if err != nil {
			return nil, err
		}
	}

	if tokensJSON != nil {
		err = json.Unmarshal(*tokensJSON, &DAO.Tokens)
		if err != nil {
			return nil, err
		}
	}

	if pocMemberJSON != nil {
		err = json.Unmarshal(*pocMemberJSON, &DAO.POCMember)
		if err != nil {
			return nil, err
		}
	}

	if membersJSON != nil {
		err = json.Unmarshal(*membersJSON, &DAO.Members)
		if err != nil {
			return nil, err
		}
	}

	if collaborationPassJSON != nil {
		err = json.Unmarshal(*collaborationPassJSON, &DAO.DaoCollaborationPass)
		if err != nil {
			return nil, err
		}
	}

	if DaoSubscriptionResponseJSON != nil {
		err = json.Unmarshal(*DaoSubscriptionResponseJSON, &DAO.Subscription)
		if err != nil {
			return nil, err
		}
	}

	return &DAO, nil
}

func GetDAOByMemberID(memberID string) ([]dao.MemberDAO, error) {
	db := db.GetSQL()
	var daos []dao.MemberDAO
	rows, err := db.Query(`SELECT mv.member_id, mv.dao_id, mv.name, mv.about, mv.guild_id,
		mv.profile_picture, mv.owner_id, mv.roles, mv.access, mv.dao_created, 
		mv.dao_updated, mv.onboarding, mv.snapshot, mv.token_gating, mv.dao_type, mv.member_joined, mv.tags,
		mv.open_to_collaboration
		FROM members_view mv
		WHERE mv.member_id = $1::uuid
		AND mv.onboarding = true
		ORDER BY dao_created DESC`, memberID)
	if err != nil {
		return daos, err
	}
	defer rows.Close()
	for rows.Next() {
		var DAO dao.MemberDAO
		var rolesJSON *json.RawMessage
		err := rows.Scan(&DAO.MemberID, &DAO.DAOID, &DAO.Name, &DAO.About, &DAO.GuildID,
			&DAO.ProfilePicture, &DAO.OwnerID, &rolesJSON, pq.Array(&DAO.Access), &DAO.DaoCreatedAt,
			&DAO.DaoUpdatedAt, &DAO.Onboarding, &DAO.Snapshot, &DAO.TokenGating,
			&DAO.DAOType, &DAO.MemberJoinedAt, pq.Array(&DAO.Tags), &DAO.OpenToCollaboration)
		if err != nil {
			return daos, err
		}

		err = json.Unmarshal(*rolesJSON, &DAO.Roles)
		if err != nil {
			return daos, err
		}

		daos = append(daos, DAO)
	}

	return daos, nil
}

func GetIDAOByMemberID(memberID string) ([]dao.MemberIDAO, error) {
	db := db.GetSQL()
	var daos []dao.MemberIDAO
	rows, err := db.Query(`SELECT mv.member_id, mv.dao_id, mv.name, mv.about,
		mv.profile_picture
		FROM members_view mv
		WHERE mv.member_id = $1::uuid
		AND mv.onboarding = true
		ORDER BY dao_created DESC`, memberID)
	if err != nil {
		return daos, err
	}
	defer rows.Close()
	for rows.Next() {
		var DAO dao.MemberIDAO
		err := rows.Scan(&DAO.MemberID, &DAO.DAOID, &DAO.Name, &DAO.About,
			&DAO.ProfilePicture)
		if err != nil {
			return daos, err
		}

		daos = append(daos, DAO)
	}

	return daos, nil
}

func UpdateDAO(DAO dao.DAO) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET name = $2, about = $3, profile_picture = $4, contract_address = $5, 
		tags = $6, open_to_collaboration = $7, poc_member_id = $8, join_dao_link = $9, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $1::uuid`,
		DAO.DAOID, DAO.Name, DAO.About, DAO.ProfilePicture, DAO.ContractAddress, pq.Array(DAO.Tags), DAO.OpenToCollaboration, DAO.POCMemberID, DAO.JoinDAOLink)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", DAO.DAOID)
	return nil
}

func DeleteDAO(daoID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM dao WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted DAO ID: %s", daoID)
	return nil
}

func GetDAOAdminIDs(daoID, access string) ([]string, error) {
	db := db.GetSQL()
	var admins []string
	rows, err := db.Query(`SELECT mv.member_id FROM members_view mv
		WHERE mv.dao_id = $1::uuid AND $2 = ANY(mv.access)`, daoID, access)
	if err != nil {
		return admins, err
	}

	defer rows.Close()

	for rows.Next() {
		var admin string
		err := rows.Scan(&admin)
		if err != nil {
			return admins, err
		}

		admins = append(admins, admin)
	}

	return admins, nil
}

func UpdateSnapshot(daoID string, snapshot string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET snapshot = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		snapshot, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func UpdateOnboarding(daoID string, onboarding bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET onboarding = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		onboarding, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func UpdateTokenGating(daoID string, tokenGating bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET token_gating = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		tokenGating, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func UpdateGuildId(daoID string, guildID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET guild_id = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		guildID, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func UpdateTags(daoID string, tags []string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET tags = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		pq.Array(tags), daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func UpdatePFP(daoID string, profile_picture string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dao SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE dao_id = $2::uuid`,
		profile_picture, daoID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated DAO ID: %s", daoID)
	return nil
}

func GetAvgPayoutTime(daoID string) (string, error) {
	db := db.GetSQL()
	var avgPayout string
	err := db.QueryRow(`
		WITH dao_tasks AS (
		SELECT task_id AS link_id, 'task' AS link_type
		FROM dblink('dbname=project', 'SELECT task_id FROM task WHERE project_id IN (SELECT project_id FROM project WHERE type = ''dao'' AND link_id = ''' || $1 || ''')') AS t(task_id uuid)
		UNION ALL
		SELECT subtask_id AS link_id, 'subtask' AS link_type
		FROM dblink('dbname=project', 'SELECT subtask_id FROM subtask WHERE project_id IN (SELECT project_id FROM project WHERE type = ''dao'' AND link_id = ''' || $1 || ''')') AS s(subtask_id uuid)
		UNION ALL
		SELECT job_id AS link_id, 'task' AS link_type
		FROM dblink('dbname=job', 'SELECT job_id FROM opportunity WHERE dao_id = ''' || $1 || '''') AS o(job_id uuid)
		UNION ALL
		SELECT bounty_id AS link_id, 'bounty' AS link_type
		FROM dblink('dbname=job', 'SELECT bounty_id FROM bounty WHERE dao_id = ''' || $1 || '''') AS b(bounty_id uuid)
		)
		SELECT AVG(EXTRACT(epoch FROM p.updated_at - p.created_at)) AS average_time_diff
		FROM (
		SELECT created_at, updated_at, link_id, link_type
		FROM (
			SELECT created_at, updated_at, link_id, link_type
			FROM dblink('dbname=project', 'SELECT created_at, updated_at, link_id, link_type FROM payout WHERE completed = true') AS p(created_at timestamp without time zone, updated_at timestamp without time zone, link_id uuid, link_type text)
			UNION ALL
			SELECT created_at, updated_at, link_id, link_type
			FROM dblink('dbname=job', 'SELECT created_at, updated_at, link_id, link_type FROM payout WHERE completed = true') AS p(created_at timestamp without time zone, updated_at timestamp without time zone, link_id uuid, link_type text)
		) AS combined_payouts
		) AS p
		JOIN dao_tasks dt ON dt.link_id = p.link_id AND dt.link_type = p.link_type;
	`, daoID).Scan(&avgPayout)

	if err != nil {
		return "", err
	}

	return avgPayout, nil

}

func getDaoIDForGuild(guilds string) (string, error) {
	db := db.GetSQL()
	var dao string
	err := db.QueryRow(`SELECT dao_id FROM dao WHERE guild_id = $1`, guilds).Scan(&dao)
	if err != nil {
		return dao, err
	}

	return dao, nil
}

func SearchDAOs(query string, limit, offset *int, tagList *[]string, typeList *[]string,
	open_to_collaboration bool, otcfilter bool, memberID *string, sort *string) ([]dao.SearchDAOResponse, error) {
	db := db.GetSQL()
	var tags *pq.StringArray
	if tagList != nil && len(*tagList) > 0 {
		Tags := pq.StringArray(*tagList)
		tags = &Tags
	}

	var types *pq.StringArray
	if typeList != nil && len(*typeList) > 0 {
		Types := pq.StringArray(*typeList)
		types = &Types
	}
	var daos []dao.SearchDAOResponse

	var orderByClause string
	if sort == nil {
		orderByClause = ""
	} else {
		switch *sort {
		case "high-to-low":
			orderByClause = "dao_view.members_count DESC"
		case "low-to-high":
			orderByClause = "dao_view.members_count ASC"
		default:
			orderByClause = "dao_view.updated_at DESC"
		}
	}

	queryString := `
    SELECT
        dao_view.dao_id,
		dao_view.join_dao_link,
        dao_view.name,
        dao_view.about,
        dao_view.guild_id,
        dao_view.profile_picture,
        dao_view.contract_address,
        dao_view.owner_id,
        dao_view.dao_type,
        dao_view.created_at,
        dao_view.updated_at,
        dao_view.members_profile_pictures,
        dao_view.members_count,
        dao_view.tags,
		dao_view.collaboration_pass,
        dao_view.open_to_collaboration,
        CASE WHEN members.dao_id IS NOT NULL THEN 'joined' ELSE 'not-joined' END AS ismember
    FROM
        dao_view
    LEFT JOIN
        members ON members.dao_id = dao_view.dao_id AND members.member_id = $8
    WHERE
        dao_view.onboarding = true 
        AND dao_view.name ~* $1 
        AND (CASE WHEN $4::text[] IS NOT NULL THEN dao_view.tags && $4::text[] ELSE true END)
        AND (CASE WHEN $5::text[] IS NOT NULL THEN dao_view.dao_type = ANY($5::text[]) ELSE true END)
        AND (CASE WHEN $7::boolean = true THEN dao_view.open_to_collaboration = $6::boolean ELSE true END)
    `

	if orderByClause != "" {
		queryString += "\nORDER BY " + orderByClause
	}

	queryString += "\nLIMIT $2 OFFSET $3"

	rows, err := db.Query(queryString,
		query, limit, offset, tags, types, open_to_collaboration, otcfilter, memberID)

	if err != nil {
		return daos, err
	}
	defer rows.Close()
	for rows.Next() {
		var DAO dao.SearchDAOResponse
		var collaborationPassJSON *json.RawMessage

		err := rows.Scan(&DAO.DAOID, &DAO.JoinDAOLink, &DAO.Name, &DAO.About, &DAO.GuildID, &DAO.ProfilePicture, &DAO.ContractAddress,
			&DAO.OwnerID, &DAO.DAOType, &DAO.CreatedAt, &DAO.UpdatedAt, pq.Array(&DAO.MembersProfilePictures),
			&DAO.MembersCount, pq.Array(&DAO.Tags), &collaborationPassJSON, &DAO.OpenToCollaboration, &DAO.IsMember)
		if err != nil {
			return daos, err
		}

		if collaborationPassJSON != nil {
			err = json.Unmarshal(*collaborationPassJSON, &DAO.DaoCollaborationPass)
			if err != nil {
				return nil, err
			}
		}

		daos = append(daos, DAO)
	}

	return daos, nil
}

func ClaimSubdomain(daoID string, subdomain string, providerAddress string) error {
	db := db.GetSQL()
	_, err := db.Exec(`
    INSERT INTO dao_subdomains (subdomain_claimed, dao_id, provider_address, updated_at)
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    ON CONFLICT (dao_id) DO UPDATE
    SET subdomain_claimed = EXCLUDED.subdomain_claimed, updated_at = EXCLUDED.updated_at, provider_address = EXCLUDED.provider_address
	WHERE dao_subdomains.dao_id = $2 AND dao_subdomains.approved = false;
`,
		subdomain, daoID, providerAddress)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated Subdomain Request: %s", daoID)
	return nil
}

func CheckSubdomain(subdomain string) (bool, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT count(*) FROM dao_subdomains WHERE subdomain_claimed = $1 AND approved = true`, subdomain).Scan(&count)

	if err != nil {
		return false, fmt.Errorf("error checking username: %w", err)
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}

func FetchSubdomainByDAOID(daoId string) (*dao.SubdomainInfo, error) {
	db := db.GetSQL()

	var Subdomain dao.SubdomainInfo

	err := db.QueryRow(`SELECT dao_id, subdomain_claimed, approved, provider_address
		FROM dao_subdomains
		WHERE dao_id = $1`, daoId).Scan(&Subdomain.DAOID, &Subdomain.SubdomainClaimed, &Subdomain.Approved, &Subdomain.ProviderAddress)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &Subdomain, nil
}

func GetSnapshotDataforAllDao() ([]dao.SnapshotInfo, error) {
	db := db.GetSQL()

	var snapshots []dao.SnapshotInfo

	rows, err := db.Query(`SELECT dao_id, snapshot from dao_view WHERE snapshot <> NULL OR snapshot <> '' `)
	if err != nil {
		return snapshots, err
	}
	defer rows.Close()
	for rows.Next() {
		var snapshot dao.SnapshotInfo

		err := rows.Scan(&snapshot.DAOID, &snapshot.Snapshot)
		if err != nil {
			return snapshots, err
		}

		snapshots = append(snapshots, snapshot)
	}

	return snapshots, nil
}

func GetBulkDaoForDiscovery(daoIds []string, memberId string) ([]dao.SearchDAOResponse, error) {
	db := db.GetSQL()
	var daos []dao.SearchDAOResponse

	rows, err := db.Query(`
	SELECT
		dao_view.dao_id,
		dao_view.join_dao_link,
		dao_view.name,
		dao_view.about,
		dao_view.guild_id,
		dao_view.profile_picture,
		dao_view.contract_address,
		dao_view.owner_id,
		dao_view.dao_type,
		dao_view.created_at,
		dao_view.updated_at,
		dao_view.members_profile_pictures,
		dao_view.members_count,
		dao_view.tags,
		dao_view.collaboration_pass,
		dao_view.open_to_collaboration,
		CASE WHEN members.dao_id IS NOT NULL THEN 'joined' ELSE 'not-joined' END AS ismember
	FROM
		dao_view
	LEFT JOIN
		members ON members.dao_id = dao_view.dao_id AND members.member_id = $2
	WHERE dao_view.dao_id = ANY($1::uuid[])
		`, pq.Array(daoIds), memberId)
	if err != nil {
		return daos, fmt.Errorf("error getting daos: %w", err)
	}

	defer rows.Close()
	for rows.Next() {
		var DAO dao.SearchDAOResponse
		var collaborationPassJSON *json.RawMessage

		err := rows.Scan(&DAO.DAOID, &DAO.JoinDAOLink, &DAO.Name, &DAO.About, &DAO.GuildID, &DAO.ProfilePicture, &DAO.ContractAddress,
			&DAO.OwnerID, &DAO.DAOType, &DAO.CreatedAt, &DAO.UpdatedAt, pq.Array(&DAO.MembersProfilePictures),
			&DAO.MembersCount, pq.Array(&DAO.Tags), &collaborationPassJSON, &DAO.OpenToCollaboration, &DAO.IsMember)
		if err != nil {
			return daos, err
		}

		if collaborationPassJSON != nil {
			err = json.Unmarshal(*collaborationPassJSON, &DAO.DaoCollaborationPass)
			if err != nil {
				return nil, err
			}
		}

		daos = append(daos, DAO)
	}

	return daos, nil
}

func GetSubscriptionForDao(daoId string) (dao.DaoSubscriptionResponse, error) {
	db := db.GetSQL()

	var subscription dao.DaoSubscriptionResponse
	var subscriptionJSON *json.RawMessage

	err := db.QueryRow(`SELECT subscription FROM dao_view WHERE dao_id = $1`, daoId).Scan(&subscriptionJSON)
	if err != nil {
		return subscription, err
	}

	if subscriptionJSON != nil {
		err = json.Unmarshal(*subscriptionJSON, &subscription)
		if err != nil {
			return subscription, err
		}
	}

	return subscription, nil
}
