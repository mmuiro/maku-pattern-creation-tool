package main

import (
	"database/sql"
	"fmt"
	"log"
	"mpct/server/src/routes"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

const DEFAULT_PORT = 8080

func getEnvInt(varname string) (ret int, e error) {
	s := os.Getenv(varname)
	ret, e = strconv.Atoi(s)
	return
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file.")
	}

	var port int
	if port, err = getEnvInt("PORT"); err != nil {
		log.Fatal("Invalid port.")
	}

	router := gin.Default()
	router.GET("/api", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "MPCT API",
		})
	})

	var db *sql.DB
	db_user := os.Getenv("DB_USER")
	db_pass := os.Getenv("DB_PASS")
	db_host := os.Getenv("DB_HOST")
	db_port, _ := getEnvInt("DB_PORT")
	db, err = sql.Open("postgres", fmt.Sprintf("postgresql://%s:%s@%s:%d/mpct", db_user, db_pass, db_host, db_port))
	if err != nil {
		log.Fatal("Error opening database.")
	}
	defer db.Close()

	api := router.Group("/api")
	routes.AddUserRoutes(api, db)
	routes.AddStageRoutes(api, db)
	router.SetTrustedProxies(nil)
	router.Run(fmt.Sprintf(":%d", port))
}
