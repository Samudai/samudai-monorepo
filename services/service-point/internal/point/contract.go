package point

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-point/pkg/point"
)

func AddContract(params point.Contract) error {
	db := db.GetSQL()
	var existingContract point.Contract
	err := db.QueryRow(`SELECT point_id, contract_address FROM contract WHERE point_id = $1 AND contract_address = $2`,
		params.PointID, params.ContractAddress).Scan(&existingContract.PointID, &existingContract.ContractAddress)
	if err == sql.ErrNoRows {
		for i := 0; i < len(params.Topic); i++ {
			_, err = db.Exec(`INSERT INTO contract (point_id, contract_address, topic, points_num, event, name, chain_id, pertoken_points_num, all_events, event_nft_address) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
				params.PointID, params.ContractAddress, params.Topic[i], params.PointsNum[i], params.Event[i], params.Name, params.ChainId, params.PerTokenPointsNum[i], params.AllEvents, params.EventNftAddress[i])
			if err != nil {
				return fmt.Errorf("failed to add contract: %w", err)
			}
		}
		return nil
	} else if err != nil {
		// An unexpected error occurred during the query
		return fmt.Errorf("error checking for existing contract: %w", err)
	}
	return fmt.Errorf("a contract with the same point_id and contract_address already exists")
}
func AddWebhook(params point.Webhook) error {
	db := db.GetSQL()
	// Check if a webhook with the same parameters already exists
	var existingWebhook point.Webhook
	err := db.QueryRow(`SELECT point_id, contract_address, webhook_id, is_active FROM webhooks WHERE point_id = $1 AND contract_address = $2 AND webhook_id = $3`,
		params.PointID, params.ContractAddress, params.WebhookID).Scan(&existingWebhook.PointID, &existingWebhook.ContractAddress, &existingWebhook.WebhookID, &existingWebhook.IsActive)
	if err == sql.ErrNoRows {
		_, err = db.Exec(`INSERT INTO webhooks (point_id, contract_address, webhook_id, is_active) VALUES ($1::uuid, $2, $3,$4)`,
			params.PointID, params.ContractAddress, params.WebhookID, params.IsActive)
		if err != nil {
			return fmt.Errorf("failed to add webhook: %w", err)
		}
		return nil
	} else if err != nil {
		return fmt.Errorf("error checking for existing webhook: %w", err)
	}
	return fmt.Errorf(" webhook with the same parameters already exists")
}

func UpdateContract(params point.Contract) error {
	db := db.GetSQL()
	for i := 0; i < len(params.Topic); i++ {
		updateResult, err := db.Exec(`UPDATE contract SET points_num = $4, pertoken_points_num = $5, event_nft_address = $6, updated_at = CURRENT_TIMESTAMP WHERE point_id = $1::uuid AND contract_address = $2 AND topic = $3`, params.PointID,
			params.ContractAddress, params.Topic[i], params.PointsNum[i], params.PerTokenPointsNum[i], params.EventNftAddress[i])
		if err != nil {
			return fmt.Errorf("failed to update contract: %w", err)
		}

		rowsAffected, err := updateResult.RowsAffected()
		if err != nil {
			return fmt.Errorf("failed to check rows affected: %w", err)
		}

		if rowsAffected == 0 {
			_, err = db.Exec(`INSERT INTO contract (point_id, contract_address, topic, points_num, event, name, chain_id, pertoken_points_num, all_events, event_nft_address) VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
				params.PointID, params.ContractAddress, params.Topic[i], params.PointsNum[i], params.Event[i], params.Name, params.ChainId, params.PerTokenPointsNum[i], params.AllEvents, params.EventNftAddress[i])
			if err != nil {
				return fmt.Errorf("failed to insert event: %w", err)
			}
		}
	}
	return nil
}

func UpdateContractEventPoint(params point.UpdateContract) error {
	db := db.GetSQL()
	for i := 0; i < len(params.Topic); i++ {
		_, err := db.Exec(`UPDATE contract SET points_num = $4, pertoken_points_num = $5, updated_at = CURRENT_TIMESTAMP WHERE 
        point_id = $1::uuid AND contract_address = $2 AND topic = $3`, params.PointID,
			params.ContractAddress, params.Topic[i], params.PointsNum[i], params.PerTokenPointsNum[i])
		if err != nil {
			return fmt.Errorf("failed to update contract: %w", err)
		}
	}
	return nil
}

func GetContractByIDs(contractAddress string) ([]point.ContractView, error) {
	db := db.GetSQL()
	var contracts []point.ContractView
	rows, err := db.Query(`SELECT point_id, contract_address, topic, points_num, 
	event, name, chain_id, pertoken_points_num FROM contract WHERE contract_address = $1`, contractAddress)
	if err != nil {
		return contracts, err
	}

	defer rows.Close()

	for rows.Next() {
		var contract point.ContractView
		err := rows.Scan(&contract.PointID, &contract.ContractAddress, &contract.Topic,
			&contract.PointsNum, &contract.Event, &contract.Name, &contract.ChainId, &contract.PerTokenPointsNum)
		if err != nil {
			return contracts, err
		}
		contracts = append(contracts, contract)
	}

	return contracts, nil
}
func GetContractByContractAddressPointId(contractAddress string, pointId string) ([]point.ContractView, error) {
	db := db.GetSQL()
	var contracts []point.ContractView
	rows, err := db.Query(`SELECT point_id, contract_address, topic, points_num, 
	event, name, chain_id, pertoken_points_num, event_nft_address FROM contract WHERE contract_address = $1 AND point_id = $2`, contractAddress, pointId)
	if err != nil {
		return contracts, err
	}

	defer rows.Close()

	for rows.Next() {
		var contract point.ContractView
		err := rows.Scan(&contract.PointID, &contract.ContractAddress, &contract.Topic,
			&contract.PointsNum, &contract.Event, &contract.Name, &contract.ChainId, &contract.PerTokenPointsNum, &contract.EventNftAddress)
		if err != nil {
			return contracts, err
		}
		contracts = append(contracts, contract)
	}

	return contracts, nil
}

func GetContractsByPointID(pointID string) ([]point.ContractGroup, error) {
	db := db.GetSQL()
	var contractGroups []point.ContractGroup

	rows, err := db.Query(`
        SELECT c.contract_address, c.name, c.chain_id, c.pertoken_points_num, c.topic, c.points_num, c.event, c.all_events, c.event_nft_address, w.webhook_id, w.is_active
        FROM contract c LEFT JOIN webhooks w ON c.contract_address = w.contract_address AND w.point_id = $1
        WHERE c.point_id = $1`, pointID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	contractGroupsMap := make(map[string]point.ContractGroup)

	for rows.Next() {
		var contract point.ContractView
		err := rows.Scan(&contract.ContractAddress, &contract.Name, &contract.ChainId, &contract.PerTokenPointsNum,
			&contract.Topic, &contract.PointsNum, &contract.Event, &contract.AllEvents, &contract.EventNftAddress, &contract.WebhookID, &contract.IsActive)
		if err != nil {
			return nil, err
		}

		var group point.ContractGroup
		if existingGroup, ok := contractGroupsMap[contract.ContractAddress]; ok {
			group = existingGroup
		} else {
			group = point.ContractGroup{
				ContractAddress: contract.ContractAddress,
				Name:            *contract.Name,
				ChainId:         *contract.ChainId,
				Events:          []point.ContractView{},
				WebhookID:       contract.WebhookID,
				IsActive:        contract.IsActive,
				AllEvents:       contract.AllEvents,
			}
			contractGroupsMap[contract.ContractAddress] = group
		}

		group.Events = append(group.Events, point.ContractView{
			Topic:             contract.Topic,
			PerTokenPointsNum: contract.PerTokenPointsNum,
			PointsNum:         contract.PointsNum,
			EventNftAddress:   contract.EventNftAddress,
			Event:             contract.Event,
		})

		contractGroupsMap[contract.ContractAddress] = group
	}

	for _, group := range contractGroupsMap {
		contractGroups = append(contractGroups, group)
	}
	if len(contractGroups) == 0 {
		return []point.ContractGroup{}, nil
	}
	return contractGroups, nil
}

func DeleteContract(pointID string, contractAddress string, topic string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM contract WHERE point_id = $1::uuid AND contract_address = $2 AND topic =$3`,
		pointID, contractAddress, topic)
	if err != nil {
		return fmt.Errorf("failed to delete contract: %w", err)
	}

	return nil
}
func DeleteWebhook(pointID string, contractAddress string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM webhooks WHERE point_id = $1::uuid AND contract_address = $2`,
		pointID, contractAddress)
	if err != nil {
		return fmt.Errorf("failed to delete webhook: %w", err)
	}
	_, err = db.Exec(`DELETE FROM contract WHERE point_id = $1::uuid AND contract_address = $2`,
		pointID, contractAddress)
	if err != nil {
		return fmt.Errorf("failed to delete contract: %w", err)
	}

	return nil
}
func GetWebhook(pointID string, contractAddress string) (*point.Webhook, error) {
	db := db.GetSQL()
	var webhook point.Webhook
	err := db.QueryRow(`SELECT point_id, contract_address, webhook_id, is_active
	FROM webhooks WHERE point_id = $1 AND contract_address = $2`, pointID, contractAddress).Scan(&webhook.PointID, &webhook.ContractAddress, &webhook.WebhookID, &webhook.IsActive)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &webhook, nil
}

func UpdateWebhook(webhookId string, status bool) error {
	db := db.GetSQL()

	_, err := db.Exec(`UPDATE webhooks SET is_active = $1 WHERE webhook_id =$2`, status, webhookId)
	if err != nil {
		return fmt.Errorf("failed to update contract: %w", err)
	}

	return nil
}
