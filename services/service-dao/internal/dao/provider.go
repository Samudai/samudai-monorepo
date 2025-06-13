package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateProvider(provider dao.Provider) (string, error) {
	db := db.GetSQL()
	var providerID string
	err := db.QueryRow(`INSERT INTO provider (dao_id, provider_type, address, created_by, chain_id, 
		is_default, name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING provider_id`,
		provider.DAOID, provider.ProviderType, provider.Address, provider.CreatedBy, provider.ChainID,
		provider.IsDefault, provider.Name).Scan(&providerID)
	if err != nil {
		return providerID, err
	}

	return providerID, nil
}

func GetProviderById(ProviderID string) (dao.Provider, error){
	db := db.GetSQL()
	var provider dao.Provider
	err := db.QueryRow(`SELECT provider_id, dao_id, provider_type, address, created_by, chain_id, 
		is_default, name FROM provider
		WHERE provider_id = $1::uuid`, ProviderID).Scan(&provider.ProviderID, &provider.DAOID, &provider.ProviderType,
		&provider.Address, &provider.CreatedBy, &provider.ChainID, &provider.IsDefault, &provider.Name)
	if err != nil {
		return provider, err
	}

	return provider, nil
}

func ListProvidersForDAO(daoID string) ([]dao.Provider, error) {
	db := db.GetSQL()
	var providers []dao.Provider
	rows, err := db.Query(`SELECT provider_id, id, dao_id, provider_type, address, created_by, chain_id, 
		is_default, name 
		FROM provider WHERE dao_id = $1::uuid
		ORDER BY created_at ASC`, daoID)
	if err != nil {
		return providers, err
	}
	defer rows.Close()

	for rows.Next() {
		var provider dao.Provider
		err = rows.Scan(&provider.ProviderID, &provider.ID, &provider.DAOID, &provider.ProviderType, &provider.Address,
			&provider.CreatedBy, &provider.ChainID, &provider.IsDefault, &provider.Name)
		if err != nil {
			return providers, err
		}

		providers = append(providers, provider)
	}

	return providers, nil
}

// Return provider object if exists
func DoesExistProvider(providerID string) ([]dao.Provider, error) {
	db := db.GetSQL()
	var providers []dao.Provider
	rows, err := db.Query(`SELECT provider_id, id, dao_id, provider_type, address, created_by, chain_id, 
		is_default, name 
		FROM provider WHERE provider_id = $1::uuid
		ORDER BY created_at ASC`, providerID)
	if err != nil {
		return providers, err
	}
	defer rows.Close()

	for rows.Next() {
		var provider dao.Provider
		err = rows.Scan(&provider.ProviderID, &provider.ID, &provider.DAOID, &provider.ProviderType, &provider.Address,
			&provider.CreatedBy, &provider.ChainID, &provider.IsDefault, &provider.Name)
		if err != nil {
			return providers, err
		}

		providers = append(providers, provider)
	}

	return providers, nil

}

func UpdateProvider(provider dao.Provider) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE provider SET address = $2, chain_id = $3, 
		is_default = $4, name = $5, update_at = CURRENT_TIMESTAMP WHERE provider_id = $1::uuid`,
		provider.ProviderID, provider.Address, provider.ChainID, provider.IsDefault, provider.Name)
	if err != nil {
		return err
	}

	return nil
}

func DeleteProvider(providerID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM provider WHERE provider_id = $1::uuid`, providerID)
	if err != nil {
		return err
	}
	return nil
}

func GetDefaultProvider(daoID string) (dao.Provider, error) {
	db := db.GetSQL()
	var provider dao.Provider
	err := db.QueryRow(`SELECT provider_id, id, dao_id, provider_type, address, created_by, chain_id, 
		is_default, name FROM provider WHERE dao_id = $1::uuid AND is_default = true`, daoID).Scan(&provider.ProviderID, &provider.ID,
		&provider.DAOID, &provider.ProviderType, &provider.Address, &provider.CreatedBy, &provider.ChainID,
		&provider.IsDefault, &provider.Name)
	if err != nil {
		return provider, err
	}
	return provider, nil
}

func SetDefaultProvider(daoID, providerID string, isDefault bool) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	_, err = tx.Exec(`UPDATE provider SET is_default = false WHERE dao_id = $1`, daoID)
	if err != nil {
		tx.Rollback()
		return err
	}
	_, err = tx.Exec(`UPDATE provider SET is_default = $2, updated_at = CURRENT_TIMESTAMP WHERE provider_id = $1`, providerID, isDefault)
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		return err
	}

	return nil
}
