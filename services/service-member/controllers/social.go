package controllers

import (
	"net/http"
	"strconv"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateSocialParams struct {
	Socials []pkg.Social `json:"socials"`
}

func CreateSocial(c *gin.Context) {
	var params CreateSocialParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateMemberSocial(params.Socials)
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

	err := member.UpdateMemberSocial(params.Socials)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListSocialsForMember(c *gin.Context) {
	memberID := c.Param("member_id")

	socials, err := member.ListMemberSocials(memberID)
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

	err = member.DeleteMemberSocial(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
