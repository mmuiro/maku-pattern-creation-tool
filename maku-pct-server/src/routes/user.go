package routes

import (
	"net/http"

	"database/sql"

	"github.com/gin-gonic/gin"
)

func AddUserRoutes(rg *gin.RouterGroup, db *sql.DB) {
	user := rg.Group("/user")
	user.POST("/login", func(c *gin.Context) {
		username, password, email := c.PostForm("username"), c.PostForm("password"), c.PostForm("email")
		// make appropriate checks on params
	})
	user.POST("/register")
	user.GET("/check", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "User API"})
	})
}
