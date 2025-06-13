package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreatePartnerParams struct {
	Partner pkg.Partner `json:"partner"`
}

func CreatePartner(c *gin.Context) {
	var params CreatePartnerParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	partnerID, err := dao.CreateDAOPartner(params.Partner)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"partner_id": partnerID})
}

func ListPartnersForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	partners, err := dao.ListDAOPartners(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"partners": partners})
}

func DeletePartner(c *gin.Context) {
	partnerID := c.Param("partner_id")
	daoID := c.Param("dao_id")

	err := dao.DeleteDAOPartner(daoID, partnerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreatePartnerSocialParams struct {
	PartnerSocial pkg.PartnerSocial `json:"partner_social"`
}

func CreatePartnerSocial(c *gin.Context) {
	var params CreatePartnerSocialParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	partnerSocialID, err := dao.CreateDAOPartnerSocial(params.PartnerSocial)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"partner_social_id": partnerSocialID})
}

func UpdatePartnerSocial(c *gin.Context) {
	var params CreatePartnerSocialParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAOPartnerSocial(params.PartnerSocial)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListPartnerSocialsForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	partnerSocials, err := dao.ListDAOPartnerSocials(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"partner_socials": partnerSocials})
}

func DeletePartnerSocial(c *gin.Context) {
	partnerSocialID := c.Param("partner_social_id")
	daoID := c.Param("dao_id")

	err := dao.DeleteDAOPartnerSocial(daoID, partnerSocialID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
