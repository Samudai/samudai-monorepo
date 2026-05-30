package controllers

import (
	"context"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
)

func ClearTwitterPointCache(pointID string) error {
	ctx := context.Background()
	db := db.GetRedis()

	cacheKey := fmt.Sprintf("twitter_point:%s", pointID)

	_, err := db.Del(ctx, cacheKey).Result()
	if err != nil {
		return fmt.Errorf("failed to clear cache: %w", err)
	}

	return nil
}

func ClearTwitterMemberCache(twitterUserID, twitterUsername string) error {
	ctx := context.Background()
	db := db.GetRedis()

	cacheKey := fmt.Sprintf("twitter_member:%s:%s", twitterUserID, twitterUsername)

	_, err := db.Del(ctx, cacheKey).Result()
	if err != nil {
		return fmt.Errorf("failed to clear cache: %w", err)
	}

	return nil
}
