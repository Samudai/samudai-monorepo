package controllers

import (
	"net/http"

	"github.com/Samudai/service-dao/internal/dao"
	pkg "github.com/Samudai/service-dao/pkg/dao"
	"github.com/gin-gonic/gin"
)

type CreateDAOParams struct {
	DAO pkg.DAO `json:"dao"`
}

func CreateDAO(c *gin.Context) {
	var params CreateDAOParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daoID, err := dao.CreateDAO(params.DAO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao_id": daoID})
}

func GetDAOByID(c *gin.Context) {
	daoID := c.Param("dao_id")

	dao, err := dao.GetDAOByID(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao": dao})
}

func GetDAOByGuildID(c *gin.Context) {
	guildID := c.Param("guild_id")

	DAO, err := dao.GetDAOByGuildID(guildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao": DAO})
}

func GetDAOByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")

	DAO, err := dao.GetDAOByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao": DAO})
}

func GetIDAOByMemberID(c *gin.Context) {
	memberID := c.Param("member_id")

	DAO, err := dao.GetIDAOByMemberID(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"dao": DAO})
}

func UpdateDAO(c *gin.Context) {
	var params CreateDAOParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateDAO(params.DAO)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteDAO(c *gin.Context) {
	daoID := c.Param("dao_id")

	err := dao.DeleteDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetDAOMemberIDs(c *gin.Context) {
	daoID := c.Param("dao_id")
	access := c.Param("access")

	admins, err := dao.GetDAOAdminIDs(daoID, access)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"admins": admins})
}

type UpdateSnapshotParams struct {
	DAOID    string `json:"dao_id"`
	Snapshot string `json:"snapshot"`
}

func UpdateSnapshot(c *gin.Context) {
	var params UpdateSnapshotParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateSnapshot(params.DAOID, params.Snapshot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateOnboardingParams struct {
	DAOID      string `json:"dao_id"`
	Onboarding bool   `json:"onboarding"`
}

func UpdateOnboarding(c *gin.Context) {
	var params UpdateOnboardingParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateOnboarding(params.DAOID, params.Onboarding)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTokenGatingParams struct {
	DAOID       string `json:"dao_id"`
	TokenGating bool   `json:"token_gating"`
}

func UpdateTokenGating(c *gin.Context) {
	var params UpdateTokenGatingParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateTokenGating(params.DAOID, params.TokenGating)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateTagsParams struct {
	DAOID string   `json:"dao_id"`
	Tags  []string `json:"tags"`
}

func UpdateTags(c *gin.Context) {
	var params UpdateTagsParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateTags(params.DAOID, params.Tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdatePFPParams struct {
	DAOID          string `json:"dao_id"`
	ProfilePicture string `json:"profile_picture"`
}

func UpdatePFP(c *gin.Context) {
	var params UpdatePFPParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdatePFP(params.DAOID, params.ProfilePicture)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateGuildIdParams struct {
	DAOID   string `json:"dao_id"`
	GuildID string `json:"guild_id"`
}

func UpdateGuildId(c *gin.Context) {
	var params UpdateGuildIdParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.UpdateGuildId(params.DAOID, params.GuildID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetAvgPayoutTime(c *gin.Context) {
	daoID := c.Param("dao_id")

	avgPayout, err := dao.GetAvgPayoutTime(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"Average Payout Time": avgPayout})
}

type SearchDAOParams struct {
	Query string `json:"query"`
	pkg.Pagination
	Tags                *[]string `json:"tags"`
	DAOTypes            *[]string `json:"types"`
	OpenToCollaboration bool      `json:"open_to_collaboration,omitempty"`
	OTCFIlter           bool      `json:"otcFiler"`
	MemberId            *string   `json:"member_id"`
	Sort                *string   `json:"sort"`
}

func SearchDAOs(c *gin.Context) {
	var param SearchDAOParams
	if err := c.ShouldBindJSON(&param); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daos, err := dao.SearchDAOs(param.Query, param.Limit, param.Offset, param.Tags, param.DAOTypes,
		param.OpenToCollaboration, param.OTCFIlter, param.MemberId, param.Sort)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"daos": daos})
}

type ClaimSubdomainParams struct {
	DAOID           string `json:"dao_id"`
	Subdomain       string `json:"subdomain"`
	ProviderAddress string `json:"provider_address"`
}

func ClaimSubdomain(c *gin.Context) {
	var params ClaimSubdomainParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := dao.ClaimSubdomain(params.DAOID, params.Subdomain, params.ProviderAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func CheckSubdomain(c *gin.Context) {
	subdomain := c.Param("subdomain")

	subdomain_exists, err := dao.CheckSubdomain(subdomain)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"exists": subdomain_exists})
}

func FetchSubdomainByDAOID(c *gin.Context) {
	daoId := c.Param("dao_id")

	subdomain_data, err := dao.FetchSubdomainByDAOID(daoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subdomain_data})
}

func GetSnapshotDataforAllDao(c *gin.Context) {

	subdomain_data, err := dao.GetSnapshotDataforAllDao()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subdomain_data})

}

func GetBulkDaoForDiscovery(c *gin.Context) {
	var params struct {
		DaoIDs   []string `json:"dao_ids"`
		MemberId string   `json:"member_id"`
	}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	daos_data, err := dao.GetBulkDaoForDiscovery(params.DaoIDs, params.MemberId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": daos_data})

}


func GetSubscriptionForDao(c *gin.Context) {
	daoId := c.Param("dao_id");

	subscription, err := dao.GetSubscriptionForDao(daoId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": subscription})
}