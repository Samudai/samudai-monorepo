package controllers

import (
	"net/http"

	"github.com/Samudai/service-discovery/internal/dao"
	"github.com/Samudai/service-discovery/internal/member"
	"github.com/Samudai/service-discovery/pkg/discovery"
	"github.com/gin-gonic/gin"
)

func DiscoverDAO(c *gin.Context) {
	var page discovery.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	daos, err := dao.DiscoverDAO(page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, daos)
}

func DiscoverMember(c *gin.Context) {
	var page discovery.Pagination
	if err := c.ShouldBindJSON(&page); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	members, err := member.DiscoverMember(page.Limit, page.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, members)
}
