package routes

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddStageRoutes(rg *gin.RouterGroup, db *sql.DB) {
	stage := rg.Group("/stage")
	stage.POST("/new")
	stage.GET("/check", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Stage API"})
	})
}
