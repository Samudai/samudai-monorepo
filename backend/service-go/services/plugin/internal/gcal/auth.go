package gcal

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/Samudai/samudai-pkg/logger"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
)

func Auth(redirectURI, code, linkId string) (*oauth2.Token, *string, error) {
	configFile := `{
    "web": {
        "client_id": "` + os.Getenv("GCAL_CLIENT_ID") + `",
        "project_id": "` + os.Getenv("GCAL_PROJECT_ID") + `",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "` + os.Getenv("GCAL_CLIENT_SECRET") + `",
        "redirect_uris": [
            "` + redirectURI + `"
        ],
        "javascript_origins": [
            ` + os.Getenv("GCAL_JAVASCRIPT_ORIGIN") + `
        ]
    }
}`

	config, err := google.ConfigFromJSON([]byte(configFile), calendar.CalendarScope, calendar.CalendarEventsScope, calendar.CalendarEventsReadonlyScope, calendar.CalendarReadonlyScope)
	if err != nil {
		return nil, nil, err
	}

	token, email, err := getClient(config, linkId, code)
	if err != nil {
		return nil, nil, err
	}

	return token, email, nil
}

// Retrieve a token, saves the token, then returns the generated client.
func getClient(config *oauth2.Config, memberID, authCode string) (*oauth2.Token, *string, error) {
	tok, email, err := GetAuth(memberID)
	if err != nil {
		logger.LogMessage("info", "Token not found in DB, creating new one")
		tok, err = fetchToken(config, authCode)
		if err != nil {
			return nil, nil, err
		}
		err = SaveAuth(memberID, tok)
		if err != nil {
			return nil, nil, err
		}
	}
	return tok, email, nil
}

func fetchToken(config *oauth2.Config, authCode string) (*oauth2.Token, error) {
	tok, err := config.Exchange(context.Background(), authCode)
	if err != nil {
		return nil, err
	}
	return tok, nil
}

type GcalProfileResponse struct {
	Email string `json:"email"`
}

func fetchEmail(token *oauth2.Token) (string, error) {
	url := "https://www.googleapis.com/oauth2/v3/userinfo"
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Authorization", "Bearer "+token.AccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var profile GcalProfileResponse
	err = json.Unmarshal(body, &profile)
	if err != nil {
		return "", err
	}

	return profile.Email, nil
}
