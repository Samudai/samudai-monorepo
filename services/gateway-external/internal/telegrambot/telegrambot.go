package telegrambot

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/requester"
	"github.com/Samudai/service-member/pkg/member"
)

func PublishNotifications(telegram []member.Telegram, notification_message string) error { 
	url := fmt.Sprintf("%s/api/telegram/publish/notifications", telegramBot)

	params := map[string]interface{}{
		"telegram": telegram,
		"notification_message": notification_message,
	}
	_, err := requester.Post(url, params)
	if err != nil {
		return err
	}

	return nil
}

func DisconnectTelegram(chat_id string) error {
	url := fmt.Sprintf("%s/api/telegram/disconnect/%s", telegramBot, chat_id)

	_, err := requester.Delete(url)
	if err != nil {
		return err
	}

	return nil
}