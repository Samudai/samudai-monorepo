package member

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-member/pkg/member"
	"github.com/lib/pq"
)

// Create a new member
func Create(params member.CreateMemberParam) (string, error) {
	db := db.GetSQL()
	var memberID string
	err := db.QueryRow(`INSERT INTO members (did, email) VALUES ($1, $2) RETURNING member_id`, params.Member.DID, params.Member.Email).Scan(&memberID)
	if err != nil {
		return memberID, fmt.Errorf("error inserting member: %w", err)
	}

	logger.LogMessage("info", "Added member ID: %s", memberID)

	onboarding := member.Onboarding{
		MemberID:    memberID,
		Admin:       false,
		Contributor: false,
		InviteCode:  params.InviteCode,
	}
	err = CreateOnboarding(onboarding)
	if err != nil {
		return memberID, err
	}

	wallet := member.Wallet{
		MemberID:      memberID,
		WalletAddress: params.WalletAddress,
		ChainID:       params.ChainID,
		Default:       true,
	}
	err = CreateWallet(wallet)
	if err != nil {
		return memberID, err
	}

	return memberID, nil
}

// FetchMember returns a member's information by member id
func FetchMember(params member.FetchMemberParams) (member.MemberView, error) {
	db := db.GetSQL()
	var Member member.MemberView
	var walletJSON, discordJSON, defaultWalletJSON, daoWorkedJSON, featuredProjectJSON *json.RawMessage
	fields := `mv.member_id, mv.name, mv.username, mv.phone, mv.email, 
		mv.about, mv.open_for_opportunity, mv.featured_projects, mv.skills, mv.wallets, mv.discord,
		mv.present_role,
		mv.domain_tags_for_work,
		mv.currency,
		mv.hourly_rate,
		mv.captain, mv.did, mv.created_at, mv.updated_at, mv.profile_picture,
		mv.ceramic_stream, mv.subdomain, mv.default_wallet, mv.default_wallet_address, mv.invite_code,
		COALESCE(mv.invite_count, 0) as invite_count, tags, dao_worked_with,
		mv.overdue_tasks, mv.ongoing_tasks, mv.total_tasks_taken, mv.pending_admin_reviews, mv.closed_task
		FROM member_view mv`
	var query string
	var row *sql.Row
	if params.Type == member.FetchMemberTypeMemberID {
		query = `SELECT ` + fields + ` WHERE mv.member_id = $1::uuid`
		row = db.QueryRow(query, params.MemberID)
	} else if params.Type == member.FetchMemberTypeDiscord {
		query = `SELECT ` + fields + ` LEFT JOIN discord d ON d.member_id = mv.member_id WHERE d.discord_user_id = $1`
		row = db.QueryRow(query, params.DiscordUserID)
	} else if params.Type == member.FetchMemberTypeWallet {
		query = `SELECT ` + fields + ` JOIN member_wallet mw ON mv.member_id = mw.member_id WHERE mw.wallet_address = $1`
		row = db.QueryRow(query, params.WalletAddress)
	} else if params.Type == member.FetchMemberTypeUsername {
		query = `SELECT ` + fields + ` WHERE mv.username = $1::text`
		row = db.QueryRow(query, params.Username)
	}
	err := row.Scan(&Member.MemberID, &Member.Name, &Member.Username, &Member.Phone, &Member.Email,
		&Member.About, &Member.OpenForOpportunity, &featuredProjectJSON, pq.Array(&Member.Skills), &walletJSON, &discordJSON,
		&Member.PresentRole, pq.Array(&Member.DomainTagsForWork), &Member.Currency, &Member.HourlyRate,
		&Member.Captain, &Member.DID, &Member.CreatedAt, &Member.UpdatedAt, &Member.ProfilePicture,
		&Member.CeramicStream, &Member.Subdomain, &defaultWalletJSON, &Member.DefaultWalletAddress, &Member.InviteCode,
		&Member.InviteCount, pq.Array(&Member.Tags), &daoWorkedJSON,
		&Member.OverDueTasksCount, &Member.OngoingTasksCount, &Member.TotalTasksTaken, &Member.TasksUnderReview, &Member.ClosedTask)
	if err != nil {
		if err == sql.ErrNoRows {
			return Member, fmt.Errorf("member not found")
		}
		return Member, fmt.Errorf("error getting member: %w", err)
	}

	if discordJSON != nil {
		err = json.Unmarshal(*discordJSON, &Member.Discord)
		if err != nil {
			return Member, fmt.Errorf("error unmarshalling discord: %w", err)
		}
	}

	if featuredProjectJSON != nil {
		err = json.Unmarshal(*featuredProjectJSON, &Member.FeaturedProjects)
		if err != nil {
			return Member, fmt.Errorf("error unmarshalling featured project: %w", err)
		}
	}

	if walletJSON != nil {
		err = json.Unmarshal(*walletJSON, &Member.Wallets)
		if err != nil {
			return Member, fmt.Errorf("error unmarshalling wallet: %w", err)
		}
	}

	if defaultWalletJSON != nil {
		err = json.Unmarshal(*defaultWalletJSON, &Member.DefaultWallet)
		if err != nil {
			return Member, fmt.Errorf("error unmarshalling default wallet: %w", err)
		}
	}

	if daoWorkedJSON != nil {
		err = json.Unmarshal(*daoWorkedJSON, &Member.DaoWorkedWith)
		if err != nil {
			return Member, fmt.Errorf("error unmarshalling default dao worked: %w", err)
		}
	}

	return Member, nil
}

func FetchIMember(params member.FetchMemberParams) (member.IMember, error) {
	db := db.GetSQL()
	var Member member.IMember
	fields := `mv.member_id, mv.name, mv.username, mv.email, mv.profile_picture FROM member_view mv`
	var query string
	var row *sql.Row
	if params.Type == member.FetchMemberTypeMemberID {
		query = `SELECT ` + fields + ` WHERE mv.member_id = $1::uuid`
		row = db.QueryRow(query, params.MemberID)
	} else if params.Type == member.FetchMemberTypeDiscord {
		query = `SELECT ` + fields + ` LEFT JOIN discord d ON d.member_id = mv.member_id WHERE d.discord_user_id = $1`
		row = db.QueryRow(query, params.DiscordUserID)
	} else if params.Type == member.FetchMemberTypeWallet {
		query = `SELECT ` + fields + ` JOIN member_wallet mw ON mv.member_id = mw.member_id WHERE mw.wallet_address = $1`
		row = db.QueryRow(query, params.WalletAddress)
	} else if params.Type == member.FetchMemberTypeUsername {
		query = `SELECT ` + fields + ` WHERE mv.username = $1::text`
		row = db.QueryRow(query, params.Username)
	}
	err := row.Scan(&Member.MemberID, &Member.Name, &Member.Username, &Member.Email, &Member.ProfilePicture)
	if err != nil {
		if err == sql.ErrNoRows {
			return Member, fmt.Errorf("member not found")
		}
		return Member, fmt.Errorf("error getting member: %w", err)
	}

	return Member, nil
}

// GetMembersBulk returns a member's information by id in bulk
func GetMembersBulk(members []string, query string) ([]member.MemberView, error) {
	db := db.GetSQL()
	var Members []member.MemberView
	rows, err := db.Query(`SELECT mv.member_id, mv.username, mv.profile_picture, mv.name, 
		mv.skills, mv.total_tasks_taken FROM member_view mv WHERE mv.member_id = ANY($1::uuid[])
		AND (username ~* $2 OR name ~* $2)`, pq.Array(members), query)
	if err != nil {
		return Members, fmt.Errorf("error getting member: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var Member member.MemberView
		err := rows.Scan(&Member.MemberID, &Member.Username, &Member.ProfilePicture, &Member.Name,
			pq.Array(&Member.Skills), &Member.TotalTasksTaken)
		if err != nil {
			return Members, fmt.Errorf("error scanning member: %w", err)
		}

		Members = append(Members, Member)
	}

	return Members, nil
}

// UpdateMember updates a member's information
func UpdateMember(member member.Member) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET name = $2, username = $3, phone = $4, email = $5,
		about = $6, skills = $7, profile_picture = $8, tags = $9, 
		open_for_opportunity = $10, present_role = $11, domain_tags_for_work = $12,
		currency = $13, hourly_rate = $14,
		updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, member.MemberID, member.Name, member.Username, member.Phone, member.Email,
		member.About, pq.StringArray(member.Skills), member.ProfilePicture, pq.Array(member.Tags),
		member.OpenForOpportunity, member.PresentRole, pq.Array(member.DomainTagsForWork),
		member.Currency, member.HourlyRate)
	if err != nil {
		return fmt.Errorf("error updating member: %w", err)
	}

	logger.LogMessage("info", "Updated member ID: %s", member.MemberID)
	return nil
}

func UpdateMemberOpportunityStatus(memberID string, opportunityStatus bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET open_for_opportunity = $2,
		updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, memberID, opportunityStatus)
	if err != nil {
		return fmt.Errorf("error updating member opportunity status: %w", err)
	}

	logger.LogMessage("info", "Updated opportunity status for member ID: %s", memberID)
	return nil
}

// UpdateMemberRate updates a member's hourly rate
func UpdateMemberHourlyRate(memberID string, currency string, hourlyRate string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET currency = $2, hourly_rate = $3,
		updated_at = CURRENT_TIMESTAMP 
		WHERE member_id = $1::uuid`, memberID, currency, hourlyRate)
	if err != nil {
		return fmt.Errorf("error updating member hourly rate: %w", err)
	}

	logger.LogMessage("info", "Updated Hourly rate for member ID: %s", memberID)
	return nil
}

func UpdateMemberFeaturedProjects(params member.UpdateMemberFeaturedProjectsParams) error {
	db := db.GetSQL()

	// Convert the FeaturedProjects slice to a JSON string
	featuredProjectsJSON, err := json.Marshal(params.FeaturedProjects)
	if err != nil {
		return fmt.Errorf("error marshalling featured projects: %w", err)
	}

	_, err = db.Exec(`INSERT INTO featured_projects (featured_projects, updated_at, member_id) VALUES ($2, CURRENT_TIMESTAMP, $1::uuid) ON CONFLICT (member_id) DO UPDATE SET featured_projects = EXCLUDED.featured_projects,
		updated_at = EXCLUDED.updated_at, member_id = EXCLUDED.member_id
		WHERE featured_projects.member_id = $1::uuid`, params.MemberID, featuredProjectsJSON)

	if err != nil {
		return fmt.Errorf("error updating member featured projects: %w", err)
	}

	logger.LogMessage("info", "Updated featured projects for member ID: %s", params.MemberID)
	return nil
}

// DeleteMember deletes a member
func DeleteMember(memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM members WHERE member_id=$1::uuid`, memberID)
	if err != nil {
		return fmt.Errorf("error deleting member: %w", err)
	}

	logger.LogMessage("info", "Deleted member ID: %s", memberID)
	return nil
}

func UpdateProfilePicture(memberID string, profilePicture string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET profile_picture = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, profilePicture)
	if err != nil {
		return fmt.Errorf("error updating profile picture: %w", err)
	}

	logger.LogMessage("info", "Updated profile picture for member ID: %s", memberID)
	return nil
}

func UpdateOppurtunityPref(memberID string, openForOpportunity bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET open_for_opportunity = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, openForOpportunity)
	if err != nil {
		return fmt.Errorf("error updating open for opportunity: %w", err)
	}

	logger.LogMessage("info", "Updated open for opportunity for member ID: %s", memberID)
	return nil
}

func UpdateCeramicStream(memberID string, ceramicStream string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET ceramic_stream = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, ceramicStream)
	if err != nil {
		return fmt.Errorf("error updating ceramic stream: %w", err)
	}

	logger.LogMessage("info", "Updated ceramic stream for member ID: %s", memberID)
	return nil
}

func UpdateSubdomain(memberID string, subdomain string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET subdomain = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, subdomain)
	if err != nil {
		return fmt.Errorf("error updating subdomain: %w", err)
	}

	logger.LogMessage("info", "Updated subdomain for member ID: %s", memberID)
	return nil
}

func UpdateSkills(memberID string, skills []string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET skills = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, pq.StringArray(skills))
	if err != nil {
		return fmt.Errorf("error updating skills: %w", err)
	}

	logger.LogMessage("info", "Updated skills for member ID: %s", memberID)
	return nil
}

func UpdateDomainTags(memberID string, domain_tags_for_work []string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET domain_tags_for_work = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, pq.StringArray(domain_tags_for_work))
	if err != nil {
		return fmt.Errorf("error updating domain tags: %w", err)
	}

	logger.LogMessage("info", "Updated domain tags for member ID: %s", memberID)
	return nil
}

func UpdateTags(memberID string, tags []string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET tags = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, pq.StringArray(tags))
	if err != nil {
		return fmt.Errorf("error updating skills: %w", err)
	}

	logger.LogMessage("info", "Updated tags for member ID: %s", memberID)
	return nil
}

func UpdateNameAndPfp(memberID string, name string, pfp string, email string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET name = $2, profile_picture = $3, email = $4, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, name, pfp, email)
	if err != nil {
		return fmt.Errorf("error updating sk: %w", err)
	}

	logger.LogMessage("info", "Updated name for member ID: %s", memberID)
	return nil
}

func UpdateUsername(memberID string, username string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET username = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, username)
	if err != nil {
		return fmt.Errorf("error updating sk: %w", err)
	}

	logger.LogMessage("info", "Updated username for member ID: %s", memberID)
	return nil
}

func UpdateUserOriginalName(memberID string, name string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET name = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, name)
	if err != nil {
		return fmt.Errorf("error updating sk: %w", err)
	}

	logger.LogMessage("info", "Updated name for member ID: %s", memberID)
	return nil
}

func UpdateEmail(memberID string, email string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE members SET email = $2, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1::uuid`, memberID, email)
	if err != nil {
		return fmt.Errorf("error updating sk: %w", err)
	}

	logger.LogMessage("info", "Updated email for member ID: %s", memberID)
	return nil
}

func GetIsEmailUpdated(memberID string) (bool, error) {
	db := db.GetSQL()
	var email *string
	err := db.QueryRow(`SELECT email from members where member_id=$1`, memberID).Scan(&email)
	if err != nil {
		return false, fmt.Errorf("error checking email: %w", err)
	}
	
	if email != nil {
		return true, nil
	}

	return false, nil
}

func CheckDiscordExist(memberId string) (bool, *string, error) {
	db := db.GetSQL()
	var member member.MemberDiscord
	err := db.QueryRow(`SELECT username from discord where member_id=$1`, memberId).Scan(&member.Username)

	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil, nil
		} else {
			return false, nil, fmt.Errorf("error checking discord: %w", err)
		}
	}

	return true, &member.Username, nil
}

func CheckUsernameExist(username string) (bool, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT count(*) FROM members WHERE username = $1`, username).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("error checking username: %w", err)
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}

func SearchNFilter(query string, limit, offset *int, skillList, teamList *[]string, tagList *[]string,
	open_for_opportunity bool, ofofilter bool, memberID *string, sort *string) ([]member.SearchMemberResponse, error) {
	db := db.GetSQL()
	var skills *pq.StringArray
	if skillList != nil && len(*skillList) > 0 {
		Skills := pq.StringArray(*skillList)
		skills = &Skills
	}
	var team *pq.StringArray
	if teamList != nil && len(*teamList) > 0 {
		Teams := pq.StringArray(*teamList)
		team = &Teams
	}

	var tags *pq.StringArray
	if tagList != nil && len(*tagList) > 0 {
		Tags := pq.StringArray(*tagList)
		tags = &Tags
	}
	// Think how to handle captains
	var members []member.SearchMemberResponse

	var orderByClause string
	if sort == nil {
		orderByClause = ""
	} else {
		switch *sort {
		case "old-to-new":
			orderByClause = "mv.created_at DESC"
		case "new-to-old":
			orderByClause = "mv.created_at ASC"
		default:
			orderByClause = "mv.updated_at DESC"
		}
	}

	queryString := `
    SELECT
        mv.member_id,
        mv.name,
        mv.username,
        mv.phone,
        mv.email,
        mv.about,
		mv.present_role,
		mv.domain_tags_for_work,
		mv.currency,
		mv.hourly_rate,
        mv.open_for_opportunity,
        mv.skills,
        mv.wallets,
        mv.discord,
        mv.captain,
        mv.did,
        mv.created_at,
        mv.updated_at,
        mv.profile_picture,
        mv.ceramic_stream,
        mv.default_wallet,
        mv.default_wallet_address,
        mv.tags,
        mv.dao_worked_count,
        mv.dao_worked_profile_pictures,
		mv.overdue_tasks,
		mv.ongoing_tasks,
		mv.total_tasks_taken,
		mv.pending_admin_reviews,
		CASE WHEN cr.status IS NULL THEN 'not-connected' ELSE cr.status::text
    	END AS isconnection
FROM
    member_view mv
LEFT JOIN
    connection_request cr ON (
        (cr.sender_id = mv.member_id AND cr.receiver_id = $8)
        OR (cr.sender_id = $8 AND cr.receiver_id = mv.member_id)
    )
    WHERE
        (mv.username ~* $1 OR mv.name ~* $1 OR mv.default_wallet_address ~* $1)
        AND mv.onboarding = true
        AND (CASE WHEN $4::text[] IS NOT NULL THEN mv.skills && $4::text[] ELSE true END)
        AND (CASE WHEN $5::uuid[] IS NOT NULL THEN mv.member_id = ANY($5::uuid[]) ELSE true END)
        AND (CASE WHEN $6::text[] IS NOT NULL THEN mv.tags && $6::text[] ELSE true END)
        AND (CASE WHEN $7::boolean = true THEN mv.open_for_opportunity = true ELSE true END)
	`

	if orderByClause != "" {
		queryString = queryString + "\nORDER BY " + orderByClause
	}

	queryString += "\nLIMIT $2 OFFSET $3"

	rows, err := db.Query(queryString,
		query, limit, offset, skills, team, tags, open_for_opportunity, memberID)

	if err != nil {
		return members, fmt.Errorf("error searching members: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var Member member.SearchMemberResponse
		var walletsJSON, discordJSON, defaultWalletJSON *json.RawMessage
		err = rows.Scan(&Member.MemberID, &Member.Name, &Member.Username, &Member.Phone, &Member.Email,
			&Member.About, &Member.PresentRole, pq.Array(&Member.DomainTagsForWork), &Member.Currency, &Member.HourlyRate, &Member.OpenForOpportunity, pq.Array(&Member.Skills), &walletsJSON, &discordJSON,
			&Member.Captain, &Member.DID, &Member.CreatedAt, &Member.UpdatedAt, &Member.ProfilePicture,
			&Member.CeramicStream, &defaultWalletJSON, &Member.DefaultWalletAddress, pq.Array(&Member.Tags),
			&Member.DaoWorkedCount, pq.Array(&Member.DaoWorkedProfilePictures), &Member.OverDueTasksCount,
			&Member.OngoingTasksCount, &Member.TotalTasksTaken, &Member.TasksUnderReview,
			&Member.IsConnection)
		if err != nil {
			return members, fmt.Errorf("error scanning members: %w", err)
		}
		if discordJSON != nil {
			err = json.Unmarshal(*discordJSON, &Member.Discord)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling discord: %w", err)
			}
		}

		if walletsJSON != nil {
			err = json.Unmarshal(*walletsJSON, &Member.Wallets)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling wallet: %w", err)
			}
		}

		if defaultWalletJSON != nil {
			err = json.Unmarshal(*defaultWalletJSON, &Member.DefaultWallet)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling default wallet: %w", err)
			}
		}

		members = append(members, Member)
	}
	return members, nil
}

func GetInviteCount(memberID string) (int, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT SUM(CASE (o.admin or o.contributor) WHEN true THEN 1 ELSE 0 END) FROM members m
		JOIN onboarding o ON m.invite_code = o.invite_code
		WHERE m.member_id = $1::uuid
		GROUP BY m.member_id`, memberID).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, fmt.Errorf("error getting invite count: %w", err)
	}

	return count, nil
}

func GetMemberWorkInProgress(memberID string) (member.WorkProgress, error) {
	db := db.GetSQL()
	var daoWorkedJSON *json.RawMessage
	var member member.WorkProgress
	err := db.QueryRow(`SELECT 	mv.overdue_tasks, mv.ongoing_tasks, mv.total_tasks_taken, mv.pending_admin_reviews, mv.dao_worked_with FROM member_view mv
		WHERE mv.member_id = $1::uuid`, memberID).Scan(&member.OverDueTasksCount, &member.OngoingTasksCount, &member.TotalTasksTaken, &member.TasksUnderReview, &daoWorkedJSON)
	if daoWorkedJSON != nil {
		err = json.Unmarshal(*daoWorkedJSON, &member.DaoWorkedWith)
		if err != nil {
			return member, fmt.Errorf("error unmarshalling default dao worked: %w", err)
		}
	}
	if err != nil {
		if err == sql.ErrNoRows {
			return member, nil
		}
		return member, fmt.Errorf("error getting work in progress for member: %w", err)
	}

	return member, nil
}

func GetAllContributors() ([]string, error) {
	db := db.GetSQL()
	var memberIDs []string

	rows, err := db.Query(`SELECT array_agg(m.member_id::text) AS member_ids
		FROM members m
		JOIN onboarding o ON m.member_id = o.member_id
		WHERE o.contributor = true`)
	if err != nil {
		return memberIDs, fmt.Errorf("error getting contributors: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(pq.Array(&memberIDs))
		if err != nil {
			return memberIDs, fmt.Errorf("error scanning contributors: %w", err)
		}
	}

	return memberIDs, nil
}

func GetAllOpenToWorkContributor() ([]string, error) {
	db := db.GetSQL()
	var memberIDs []string

	rows, err := db.Query(`SELECT array_agg(m.member_id::text) AS member_ids
		FROM members m
		JOIN onboarding o ON m.member_id = o.member_id 
		WHERE m.open_for_opportunity = true AND o.contributor = true`)
	if err != nil {
		return memberIDs, fmt.Errorf("error getting contributors: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		err := rows.Scan(pq.Array(&memberIDs))
		if err != nil {
			return memberIDs, fmt.Errorf("error scanning contributors: %w", err)
		}
	}

	return memberIDs, nil
}

func GetBulkMemberForDiscovery(memberIds []string, memberId string) ([]member.SearchMemberResponse, error) {
	db := db.GetSQL()
	var members []member.SearchMemberResponse

	rows, err := db.Query(`
	SELECT
        mv.member_id,
        mv.name,
        mv.username,
        mv.phone,
        mv.email,
        mv.about,
		mv.present_role,
		mv.domain_tags_for_work,
		mv.currency,
		mv.hourly_rate,
        mv.open_for_opportunity,
        mv.skills,
        mv.wallets,
        mv.discord,
        mv.captain,
        mv.did,
        mv.created_at,
        mv.updated_at,
        mv.profile_picture,
        mv.ceramic_stream,
        mv.default_wallet,
        mv.default_wallet_address,
        mv.tags,
        mv.dao_worked_count,
        mv.dao_worked_profile_pictures,
		mv.overdue_tasks,
		mv.ongoing_tasks,
		mv.total_tasks_taken,
		mv.pending_admin_reviews,
		CASE WHEN cr.status IS NULL THEN 'not-connected' ELSE cr.status::text
    	END AS isconnection
	FROM
		member_view mv
	LEFT JOIN
		connection_request cr ON (
			(cr.sender_id = mv.member_id AND cr.receiver_id = $2)
			OR (cr.sender_id = $2 AND cr.receiver_id = mv.member_id)
		)
    WHERE mv.member_id = ANY($1::uuid[])
		`, pq.Array(memberIds), memberId)
	if err != nil {
		return members, fmt.Errorf("error searching members: %w", err)
	}

	defer rows.Close()

	for rows.Next() {
		var Member member.SearchMemberResponse
		var walletsJSON, discordJSON, defaultWalletJSON *json.RawMessage
		err = rows.Scan(&Member.MemberID, &Member.Name, &Member.Username, &Member.Phone, &Member.Email,
			&Member.About, &Member.PresentRole, pq.Array(&Member.DomainTagsForWork), &Member.Currency, &Member.HourlyRate, &Member.OpenForOpportunity, pq.Array(&Member.Skills), &walletsJSON, &discordJSON,
			&Member.Captain, &Member.DID, &Member.CreatedAt, &Member.UpdatedAt, &Member.ProfilePicture,
			&Member.CeramicStream, &defaultWalletJSON, &Member.DefaultWalletAddress, pq.Array(&Member.Tags),
			&Member.DaoWorkedCount, pq.Array(&Member.DaoWorkedProfilePictures), &Member.OverDueTasksCount,
			&Member.OngoingTasksCount, &Member.TotalTasksTaken, &Member.TasksUnderReview,
			&Member.IsConnection)
		if err != nil {
			return members, fmt.Errorf("error scanning members: %w", err)
		}
		if discordJSON != nil {
			err = json.Unmarshal(*discordJSON, &Member.Discord)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling discord: %w", err)
			}
		}

		if walletsJSON != nil {
			err = json.Unmarshal(*walletsJSON, &Member.Wallets)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling wallet: %w", err)
			}
		}

		if defaultWalletJSON != nil {
			err = json.Unmarshal(*defaultWalletJSON, &Member.DefaultWallet)
			if err != nil {
				return members, fmt.Errorf("error unmarshalling default wallet: %w", err)
			}
		}

		members = append(members, Member)
	}
	return members, nil
}

func GetBulkTelegramChatIds(memberIds []string) ([]member.Telegram, error) {
	db := db.GetSQL()
	var telegrams []member.Telegram

	rows, err := db.Query(`SELECT mv.telegram
		FROM member_view mv
		WHERE mv.member_id = ANY($1::uuid[])
		`, pq.Array(memberIds))
	if err != nil {
		return telegrams, fmt.Errorf("error getting contributors: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var telegram member.Telegram
		var telegramJSON *json.RawMessage

		err = rows.Scan(&telegramJSON)
		if err != nil {
			return telegrams, fmt.Errorf("error scanning members: %w", err)
		}
		if telegramJSON != nil {
			err = json.Unmarshal(*telegramJSON, &telegram)
			if err != nil {
				return telegrams, fmt.Errorf("error unmarshalling telegram: %w", err)
			}
		}
		if telegram.TelegramID != "" {
			telegrams = append(telegrams, telegram)
		}

	}
	return telegrams, nil
}
