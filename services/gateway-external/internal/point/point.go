package point

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-point/pkg/point"
)

func UpdatePointGuildId(pointID, guildID, serverName string) error {
	url := fmt.Sprintf("%s/point/update/guildId", pointService)

	params := map[string]interface{}{
		"point_id":    pointID,
		"guild_id":    guildID,
		"server_name": serverName,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}
	return nil
}
func GetPointByGuildID(guildID string) (point.Point, error) {
	url := fmt.Sprintf("%s/point/pointid/%s", pointService, guildID)
	respBody, err := requester.Get(url)
	if err != nil {
		return point.Point{}, err
	}

	var resp struct {
		Point point.Point `json:"point"`
	}
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return point.Point{}, err
	}

	return resp.Point, nil
}
