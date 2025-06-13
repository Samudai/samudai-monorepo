package discord

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-discord/pkg/discord"
)

const discordAPI = "https://discord.com/api/v10"

type discordError struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

func DiscordAuth(redirectURI, code string) (*discord.DiscordAccessToken, error) {
	data := url.Values{}
	data.Set("client_id", os.Getenv("DISCORD_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("DISCORD_CLIENT_SECRET"))
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)

	client := &http.Client{}
	url := fmt.Sprintf("%s/oauth2/token", discordAPI)
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, fmt.Errorf("discord: failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("discord: failed to do request: %w", err)
	}

	defer resp.Body.Close()

	bodyByte, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		var result discordError
		err = json.Unmarshal(bodyByte, &result)
		if err != nil {
			return nil, fmt.Errorf("discord: failed to decode body: %w", err)
		}

		return nil, fmt.Errorf("discord: failed to get access token: %s - %s", result.Error, result.ErrorDescription)
	}

	var result discord.DiscordAccessToken
	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return nil, fmt.Errorf("github: failed to decode response: %w", err)
	}

	return &result, nil
}

// MemberDiscord represents a member's discord information - copied from service-member pkg
type MemberDiscord struct {
	ID            string  `json:"id"`
	DiscordUserID string  `json:"discord_user_id"`
	Username      string  `json:"username"`
	Avatar        *string `json:"avatar"`
	Discriminator string  `json:"discriminator"`
	PublicFlags   int     `json:"public_flags,omitempty"`
	Flags         int     `json:"flags,omitempty"`
	Banner        *string `json:"banner,omitempty"`
	BannerColor   *string `json:"banner_color,omitempty"`
	AccentColor   *int    `json:"accent_color,omitempty"`
	Locale        string  `json:"locale"`
	MfaEnabled    bool    `json:"mfa_enabled,omitempty"`
	Verified      bool    `json:"verified,omitempty"`
	Email         string  `json:"email"`
}

func GetUserData(token discord.DiscordAccessToken, memberID string) (MemberDiscord, error) {
	var result MemberDiscord
	newToken, err := getRefreshToken(token)
	if err != nil {
		return result, err
	}

	if newToken.Accesstoken == "" {
		return result, fmt.Errorf("discord: failed to get access token")
	}
	logger.LogMessage("info", "discord refresh token fetched successfully!")

	data := discord.AuthData{
		MemberID: memberID,
		Token:    *newToken,
	}
	err = SaveAuthData(data)
	if err != nil {
		return result, err
	}

	url := fmt.Sprintf("%s/users/@me", discordAPI)
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return result, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("%s %s", token.TokenType, newToken.Accesstoken))

	resp, err := client.Do(req)
	if err != nil {
		return result, err
	}

	defer resp.Body.Close()

	bodyByte, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, err
	}

	if resp.StatusCode != http.StatusOK {
		var result discordError
		err = json.Unmarshal(bodyByte, &result)
		if err != nil {
			return MemberDiscord{}, fmt.Errorf("discord: failed to decode body: %w", err)
		}

		return MemberDiscord{}, fmt.Errorf("discord: failed to get access token: %s - %s", result.Error, result.ErrorDescription)
	}

	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return result, err
	}

	result.DiscordUserID = result.ID
	return result, nil
}

func GetUserDataPoint(token discord.DiscordAccessToken, memberID string) (MemberDiscord, error) {
	var result MemberDiscord
	newToken, err := getRefreshToken(token)
	if err != nil {
		return result, err
	}

	if newToken.Accesstoken == "" {
		return result, fmt.Errorf("discord: failed to get access token")
	}
	logger.LogMessage("info", "discord refresh token fetched successfully!")

	data := discord.AuthData{
		MemberID: memberID,
		Token:    *newToken,
	}
	err = SaveAuthDataPoint(data)
	if err != nil {
		return result, err
	}

	url := fmt.Sprintf("%s/users/@me", discordAPI)
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return result, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("%s %s", token.TokenType, newToken.Accesstoken))

	resp, err := client.Do(req)
	if err != nil {
		return result, err
	}

	defer resp.Body.Close()

	bodyByte, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, err
	}

	if resp.StatusCode != http.StatusOK {
		var result discordError
		err = json.Unmarshal(bodyByte, &result)
		if err != nil {
			return MemberDiscord{}, fmt.Errorf("discord: failed to decode body: %w", err)
		}

		return MemberDiscord{}, fmt.Errorf("discord: failed to get access token: %s - %s", result.Error, result.ErrorDescription)
	}

	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return result, err
	}

	result.DiscordUserID = result.ID
	return result, nil
}

type Guild struct {
	GuildID        string   `json:"id"`
	Name           string   `json:"name"`
	Icon           *string  `json:"icon"`
	Owner          bool     `json:"owner"`
	Permissions    string   `json:"permissions"`
	Features       []string `json:"features"`
	PermissionsNew string   `json:"permissions_new"`
}

func GetGuilds(token discord.DiscordAccessToken) ([]Guild, error) {
	var result []Guild
	url := fmt.Sprintf("%s/users/@me/guilds", discordAPI)
	client := &http.Client{}
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return result, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("%s %s", token.TokenType, token.Accesstoken))

	resp, err := client.Do(req)
	if err != nil {
		return result, err
	}

	defer resp.Body.Close()

	bodyByte, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, err
	}

	if resp.StatusCode != http.StatusOK {
		var result discordError
		err = json.Unmarshal(bodyByte, &result)
		if err != nil {
			return []Guild{}, fmt.Errorf("discord: failed to decode body: %w", err)
		}

		return []Guild{}, fmt.Errorf("discord: failed to get guilds: %s - %s", result.Error, result.ErrorDescription)
	}

	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return result, err
	}

	return result, nil
}

func getRefreshToken(token discord.DiscordAccessToken) (*discord.DiscordAccessToken, error) {
	data := url.Values{}
	data.Set("client_id", os.Getenv("DISCORD_CLIENT_ID"))
	data.Set("client_secret", os.Getenv("DISCORD_CLIENT_SECRET"))
	data.Set("grant_type", "refresh_token")
	data.Set("refresh_token", token.RefreshToken)

	client := &http.Client{}
	url := fmt.Sprintf("%s/oauth2/token", discordAPI)
	req, err := http.NewRequest(http.MethodPost, url, strings.NewReader(data.Encode()))
	if err != nil {
		return nil, fmt.Errorf("discord: failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("discord: failed to do request: %w", err)
	}

	defer resp.Body.Close()

	bodyByte, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		var result discordError
		err = json.Unmarshal(bodyByte, &result)
		if err != nil {
			return nil, fmt.Errorf("discord: failed to decode body: %w", err)
		}

		return nil, fmt.Errorf("discord: failed to get access token: %s - %s", result.Error, result.ErrorDescription)
	}

	var result discord.DiscordAccessToken
	err = json.Unmarshal(bodyByte, &result)
	if err != nil {
		return nil, fmt.Errorf("github: failed to decode response: %w", err)
	}

	return &result, nil
}
