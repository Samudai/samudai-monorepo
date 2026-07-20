package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/Samudai/backend/services/dao/internal/dao"
	pkg "github.com/Samudai/backend/services/dao/pkg/dao"
)

type CreateBlogParams struct {
	Blog pkg.Blog `json:"blog"`
}

func CreateBlog(c *gin.Context) {
	var params CreateBlogParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	blogID, err := dao.CreateBlog(params.Blog)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"blog_id": blogID})
}

func ListBlogsForDAO(c *gin.Context) {
	daoID := c.Param("dao_id")
	blogs, err := dao.ListBlogsForDAO(daoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, blogs)
}

func DeleteBlog(c *gin.Context) {
	blogID := c.Param("blog_id")
	id, err := strconv.Atoi(blogID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = dao.DeleteBlog(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
