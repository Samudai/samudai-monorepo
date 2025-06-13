package controllers

import (
	"net/http"

	"github.com/Samudai/service-discussion/internal/discussion"
	pkg "github.com/Samudai/service-discussion/pkg/discussion"
	"github.com/gin-gonic/gin"
)

type CreateDiscussionParam struct {
	Discussion pkg.Discussion `json:"discussion"`
}

func CreateDiscussion(c *gin.Context) {
	var params CreateDiscussionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	discussionID, err := discussion.CreateDiscussion(params.Discussion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"discussion_id": discussionID})
}

func UpdateDiscussion(c *gin.Context) {
	var params CreateDiscussionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.UpdateDiscussion(params.Discussion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

type UpdateBookmarkParam struct {
	Discussion pkg.UpdateBookmarkParams `json:"discussion"`
}

func UpdateBookmark(c *gin.Context) {
	var params UpdateBookmarkParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.UpdateBookmark(params.Discussion)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func UpdateView(c *gin.Context) {
	discussionID := c.Param("discussion_id")
	err := discussion.UpdateView(discussionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func GetDiscussionsByID(c *gin.Context) {
	discussionID := c.Param("discussion_id")
	discussion, err := discussion.GetDiscussionByID(discussionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, discussion)
}

func GetTagsByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")
	discussion, err := discussion.GetTagsByDAOID(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, discussion)
}

type GetDiscussionsByDAOIDParam struct {
	Empty bool `json:"empty"`
	pkg.Pagination
}

func GetDiscussionsByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")
	var params GetDiscussionsByDAOIDParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	discussions, err := discussion.GetDiscussionsByDAOID(daoID, params.Empty, params.Limit, params.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, discussions)
}

func GetDiscussionsCountByDAOID(c *gin.Context) {
	daoID := c.Param("dao_id")

	count, err := discussion.GetDiscussionsCountByDAOID(daoID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

func GetDiscussionsByProposalID(c *gin.Context) {
	proposalID := c.Param("proposal_id")

	discussions, err := discussion.GetDiscussionsByProposalID(proposalID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, discussions)
}

type GetDiscussionsByMemberIDParam struct {
	DAOID    string `json:"dao_id"`
	MemberID string `json:"member_id"`
	pkg.Pagination
}

func GetDiscussionsByMemberID(c *gin.Context) {
	var params GetDiscussionsByMemberIDParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	discussions, err := discussion.GetDiscussionsByMemberID(params.MemberID, params.DAOID, params.Limit, params.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, discussions)
}

func GetActiveForum(c *gin.Context) {
	daoID := c.Param("dao_id")

	discussions, err := discussion.GetActiveForum(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"active_forum_count": discussions})
}

type CloseDiscussionparam struct {
	DiscussionID string `json:"discussion_id"`
	Closed       bool   `json:"closed"`
	UpdatedBy    string `json:"updated_by"`
}

func CloseDiscussion(c *gin.Context) {
	var params CloseDiscussionparam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := discussion.CloseDiscussion(params.DiscussionID, params.Closed, params.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
