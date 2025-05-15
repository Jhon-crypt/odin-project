package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Start Next.js development server
	go startNextServer()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "healthy",
				"message": "API is running",
			})
		})
	}

	// Start the server
	log.Println("Starting backend server on :8080...")
	r.Run(":8080")
}

func startNextServer() {
	// Change to the frontend directory
	if err := os.Chdir("frontend"); err != nil {
		log.Printf("Error changing to frontend director: %v\n", err)
		return
	}

	var cmd *exec.Cmd
	if runtime.GOOS == "windows" {
		cmd = exec.Command("npm.cmd", "run", "dev")
	} else {
		cmd = exec.Command("npm", "run", "dev")
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = append(os.Environ(), "PORT=3000")

	if err := cmd.Start(); err != nil {
		log.Printf("Error starting Next.js server: %v\n", err)
		return
	}

	// Change back to the root directory
	if err := os.Chdir(".."); err != nil {
		log.Printf("Error changing back to root directory: %v\n", err)
	}
} 