package controllers

import (
	"net/http"

	"github.com/Samudai/service-member/internal/member"
	pkg "github.com/Samudai/service-member/pkg/member"
	"github.com/gin-gonic/gin"
)

type CreateConnectionParam struct {
	Connection pkg.ConnectionRequest `json:"connection"`
}

func CreateConnection(c *gin.Context) {
	var params CreateConnectionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.CreateConnection(params.Connection)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListConnectionsBySenderID(c *gin.Context) {
	senderID := c.Param("sender_id")
	connections, err := member.ListConnectionsBySenderID(senderID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connections": connections})
}

func ListConnectionsByReceiverID(c *gin.Context) {
	receiverID := c.Param("receiver_id")
	connections, err := member.ListConnectionsByReceiverID(receiverID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connections": connections})
}

func UpdateConnection(c *gin.Context) {
	var params CreateConnectionParam
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := member.UpdateConnection(params.Connection)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func DeleteConnection(c *gin.Context) {
	senderID := c.Param("sender_id")
	receiverID := c.Param("receiver_id")

	err := member.DeleteConnection(senderID, receiverID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})
}

func ListConnectionsForMember(c *gin.Context) {
	memberID := c.Param("member_id")
	connections, err := member.ListConnectionsForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connections": connections, "total": len(connections)})
}

func ListAllConnectionsForMember(c *gin.Context) {
	memberID := c.Param("member_id")
	connections, err := member.ListAllConnectionsForMember(memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"connections": connections, "total": len(connections)})
}

func GetConnectionStatus(c *gin.Context) {
	viewerID := c.Param("viewer_id")
	memberID := c.Param("member_id")

	connection, err := member.GetConnectionStatus(viewerID, memberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, connection)
}

func ConnectionExist(c *gin.Context) {
	member1 := c.Param("member1")
	member2 := c.Param("member2")

	connection, err := member.ConnectionExist(member1, member2)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, connection)
}
