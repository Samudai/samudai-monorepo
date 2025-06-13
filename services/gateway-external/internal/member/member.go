package member

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-member/pkg/member"
)

type GetByDiscordUserIDResp struct {
	Member member.Member `json:"member"`
}

func GetByDiscordUserID(discordUserID string) (member.Member, error) {
	url := fmt.Sprintf("%s/member/fetch", memberService)
	var Member member.Member

	fmt.Println("Fetching member by discord user id", discordUserID)
	params := member.FetchMemberParams{
		Type:          member.FetchMemberTypeDiscord,
		DiscordUserID: &discordUserID,
	}
	respBody, err := requester.Post(url, params)
	if err != nil {
		return Member, err
	}

	var resp GetByDiscordUserIDResp
	err = json.Unmarshal(respBody, &resp)
	if err != nil {
		return Member, err
	}

	return resp.Member, nil
}


func AddTelegram(telegram member.Telegram) error {
	url := fmt.Sprintf("%s/telegram/add", memberService)

	params := map[string]interface{}{
		"telegram": telegram,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}
