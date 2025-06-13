package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateMemberParams struct {
	Member pkg.Member `json:"member"`
}

func CreateMember(c *gin.Context) {
	var params CreateMemberParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAOMember(params.Member)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type CreateMembersParams struct {
	Members []pkg.Member `json:"members"`
}

func CreateMembers(c *gin.Context) {
	var params CreateMembersParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAOMembers(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func MapDiscordBulk(c *gin.Context) {
	var params pkg.MapDiscordBulkParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.CreateDAOMembersDiscord(params.Members)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	err = dao.CreateMemberRolesDiscord(params.DiscordMemberRoles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListMembersForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")
	var page pkg.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := dao.ListDAOMembers(daoID, page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": members})
}

func GetMembersForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	members, err := dao.GetMembersForDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"members": members})
}

func ListMembersForDAOUUID(c *gin.Context) {
	daoID := c.Param("dao_id")

	members, err := dao.ListDAOMembersUUID(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, members)
}

func DeleteMember(c *gin.Context) {
	memberID := c.Param("member_id")
	daoID := c.Param("dao_id")

	err := dao.DeleteDAOMember(daoID, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func MapDiscordAuth(c *gin.Context) {
	var params pkg.MapDiscordParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.MapDiscord(params.MemberID, params.Guilds)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateDAOMemberLicenseParams struct {
	DAOID          string `json:"dao_id"`
	MemberID       string `json:"member_id"`
	LicensedMember bool   `json:"licensed_member"`
}

func UpdateDAOMemberLicense(c *gin.Context) {
	var params UpdateDAOMemberLicenseParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAOMemberLicense(params.DAOID, params.MemberID, params.LicensedMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateDAOMemberLicenseBulkParams struct {
	DAOID          string   `json:"dao_id"`
	MemberIDs      []string `json:"member_ids"`
	LicensedMember bool     `json:"licensed_member"`
}

func UpdateDAOMemberLicenseBulk(c *gin.Context) {
	var params UpdateDAOMemberLicenseBulkParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAOMemberLicenseBulk(params.DAOID, params.MemberIDs, params.LicensedMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetLicensedMemberCount(c *gin.Context) {
	daoId := c.Param("dao_id")

	count, err := dao.GetLicensedMemberCount(daoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
