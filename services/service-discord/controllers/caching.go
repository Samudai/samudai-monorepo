package controllers

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
)

func GetCachedOrFetchMember(received pkg.ActivityGuild) (pkg.TwitterResponse, error) {
	ctx := context.Background()
	db := db.GetRedis()

	var member pkg.TwitterResponse
	if received.RequestType == "TwitterTip" {
		pointsCacheKey := fmt.Sprintf("twitter_point:%s", received.PointId)
		memberCacheKey := fmt.Sprintf("twitter_member:%s:%s", *received.ToTwitterUserId, *received.ToTwitterUsername)

		cachedMember, err := db.Get(ctx, memberCacheKey).Result()
		cachedPointsJSON, err := db.Get(ctx, pointsCacheKey).Result()

		if err == nil && cachedMember != "" && cachedPointsJSON != "" {
			member.MemberID = cachedMember
			json.Unmarshal([]byte(cachedPointsJSON), &member.Points)
			return member, nil
		}

		member, err = discord.GetTwitterMember(received.PointId, *received.ToTwitterUserId, *received.ToTwitterUsername)
		if err != nil {
			return member, fmt.Errorf("something went wrong: %w", err)
		}

		pointsJSON, err := json.Marshal(member.Points)
		if err != nil {
			return member, fmt.Errorf("failed to marshal points: %w", err)
		}
		err = db.Set(ctx, pointsCacheKey, pointsJSON, 0).Err()
		if err != nil {
			return member, fmt.Errorf("failed to cache points: %w", err)
		}

		err = db.Set(ctx, memberCacheKey, member.MemberID, 0).Err()
		if err != nil {
			return member, fmt.Errorf("failed to cache member ID: %w", err)
		}

	}

	return member, nil
}
