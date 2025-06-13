package controllers

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/mergermarket/go-pkcs7"

	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/gin-gonic/gin"
)

type AddTwitterForPointParam struct {
	Twitter pkg.Twitter `json:"twitter"`
}

type AddTwitterEventsParam2 struct {
	TwitterEvents pkg.TwitterPoints `json:"twitter"`
}

func encrypt(unencrypted string) (string, error) {
	keyString := os.Getenv("ENCRYPTION_KEY")
	key := []byte(keyString)
	plainText := []byte(unencrypted)
	plainText, err := pkcs7.Pad(plainText, aes.BlockSize)
	if err != nil {
		return "", fmt.Errorf(`plainText: "%s" has error`, plainText)
	}
	if len(plainText)%aes.BlockSize != 0 {
		err := fmt.Errorf(`plainText: "%s" has the wrong block size`, plainText)
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	cipherText := make([]byte, aes.BlockSize+len(plainText))
	iv := cipherText[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(cipherText[aes.BlockSize:], plainText)

	return fmt.Sprintf("%x", cipherText), nil
}

func AddTwitterForPoint(c *gin.Context) {
	var params AddTwitterForPointParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var params2 AddTwitterEventsParam2
	params2.TwitterEvents.PointID = params.Twitter.PointID
	params2.TwitterEvents.TweetID = []string{}

	err := point.AddTwitterForPoint(params.Twitter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = point.AddTwitterPoints(params2.TwitterEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateTwitterForPoint(c *gin.Context) {
	var params AddTwitterForPointParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	encryptedAccessToken, err := encrypt(params.Twitter.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	encryptedRefreshToken, err := encrypt(params.Twitter.RefreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	params.Twitter.AccessToken = encryptedAccessToken
	params.Twitter.RefreshToken = encryptedRefreshToken
	err = point.UpdateTwitterForPoint(params.Twitter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTwitterTokensParam struct {
	PointID      string `json:"point_id"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func UpdateTwitterTokens(c *gin.Context) {
	var params UpdateTwitterTokensParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	encryptedAccessToken, err := encrypt(params.AccessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	encryptedRefreshToken, err := encrypt(params.RefreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	err = point.UpdateTwitterTokens(params.PointID, encryptedAccessToken, encryptedRefreshToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTwitterStatusParam struct {
	PointID string `json:"point_id"`
	Status  bool   `json:"status"`
}

func UpdateTwitterStatus(c *gin.Context) {
	var params UpdateTwitterStatusParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := point.UpdateTwitterStatus(params.PointID, params.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetTwitterByPointID(c *gin.Context) {
	pointID := c.Param("point_id")

	twitter, err := point.GetTwitterByPointID(pointID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"twitter": twitter})
}

func GetAllTwitterPoint(c *gin.Context) {
	twitters, err := point.GetAllTwitterPoint()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"twitters": twitters})
}
