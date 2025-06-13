package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateSocialParams struct {
	Social []pkg.Social `json:"social"`
}

func CreateSocial(c *gin.Context) {
	var params CreateSocialParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAOSocial(params.Social)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateSocial(c *gin.Context) {
	var params CreateSocialParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAOSocial(params.Social)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListSocialsForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	socials, err := dao.ListDAOSocials(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"socials": socials})
}

func DeleteSocial(c *gin.Context) {
	socialID := c.Param("social_id")
	id, err := strconv.Atoi(socialID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = dao.DeleteDAOSocial(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
