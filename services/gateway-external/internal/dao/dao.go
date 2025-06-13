package dao

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateDAO(name, guildID string, description *string) (string, error) {
	url := fmt.Sprintf("%s/dao/create", daoService)

	dao := dao.DAO{
		Name:    name,
		GuildID: guildID,
		About:   description,
		DAOType: dao.DAOTypeGeneral,
	}
	params := map[string]interface{}{
		"dao": dao,
	}
	respBody, err := requester.Post(url, params)
	if err != nil {
		return "", err
	}

	var resp struct {
		DaoID string `json:"dao_id"`
	}
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return "", err
	}

	return resp.DaoID, nil
}

func UpdateDAOGuildId(daoID, guildID string) error {
	url := fmt.Sprintf("%s/dao/update/guildId", daoService)

	params := map[string]interface{}{
		"dao_id": daoID,
		"guild_id": guildID,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}
	return nil
}

func getByGuildID(guildID string) (dao.DAO, error) {
	url := fmt.Sprintf("%s/dao/byguildid/%s", daoService, guildID)
	respBody, err := requester.Get(url)
	if err != nil {
		return dao.DAO{}, err
	}

	var resp struct {
		Dao dao.DAO `json:"dao"`
	}
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return dao.DAO{}, err
	}

	return resp.Dao, nil
}
