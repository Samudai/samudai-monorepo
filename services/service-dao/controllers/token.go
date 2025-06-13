package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateTokenParam struct {
	Token pkg.Token `json:"token"`
}

func CreateToken(c *gin.Context) {
	var param CreateTokenParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokenID, err := dao.CreateToken(param.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token_id": tokenID})
}

func GetTokenByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")

	token, err := dao.GetTokenByDAOID(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"tokens": token})
}

func UpdateToken(c *gin.Context) {
	var param CreateTokenParam
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateToken(param.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteToken(c *gin.Context) {
	tokenID := c.Param("token_id")
	id, err := strconv.Atoi(tokenID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = dao.DeleteToken(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
