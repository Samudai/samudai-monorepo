package githubapp

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
)

func getDAOIDForInstallation(installationID int64) (string, error) {
	url := fmt.Sprintf("%s/getdaoidforinstallation/%d", githubAppService, installationID)

	resp, err := requester.Get(url)
	if err != nil {
		return "", err
	}

	var data struct {
		DAOID string `json:"dao_id"`
	}
	err = json.Unmarshal(resp, &data)
	if err != nil {
		return "", err
	}

	return data.DAOID, nil
}
