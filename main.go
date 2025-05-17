package main

import (
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	"odin-project/pkg/llm"

	"github.com/gin-gonic/gin"
)

type ResearchRequest struct {
	Provider  string `json:"provider"`  // "openai" or "gemini"
	Model     string `json:"model"`     // e.g. "gpt-4.1-2025-04-14"
	Query     string `json:"query"`     // The research query
	MaxTokens int    `json:"maxTokens"` // Maximum tokens for response
	Stream    bool   `json:"stream"`    // Whether to stream the response
}

type ResearchResponse struct {
	Result     string `json:"result"`
	Provider   string `json:"provider"`
	Model      string `json:"model"`
	TokensUsed int    `json:"tokensUsed"`
}

func handleResearch(c *gin.Context) {
	var req ResearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate request
	if req.Provider == "" || req.Model == "" || req.Query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Create LLM provider
	provider, err := llm.NewProvider(req.Provider)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid provider: " + err.Error()})
		return
	}

	// Set default max tokens if not provided
	if req.MaxTokens == 0 {
		req.MaxTokens = 2000
	}

	// Handle streaming request
	if req.Stream {
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.Header("Transfer-Encoding", "chunked")

		resultChan := make(chan string, 100)
		errChan := make(chan error, 1)

		go func() {
			errChan <- provider.StreamResearch(c.Request.Context(), req.Query, req.Model, req.MaxTokens, resultChan)
		}()

		c.Stream(func(w io.Writer) bool {
			select {
			case chunk, ok := <-resultChan:
				if !ok {
					return false
				}
				c.SSEvent("message", chunk)
				return true
			case err := <-errChan:
				if err != nil {
					c.SSEvent("error", gin.H{"error": err.Error()})
				}
				return false
			}
		})
		return
	}

	// Handle non-streaming request
	result, err := provider.Research(c.Request.Context(), req.Query, req.Model, req.MaxTokens)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Research failed: " + err.Error()})
		return
	}

	response := ResearchResponse{
		Result:     result.Content,
		Provider:   req.Provider,
		Model:      result.Model,
		TokensUsed: result.TokensUsed,
	}

	c.JSON(http.StatusOK, response)
}

func main() {
	// Start Next.js development server
	go startNextServer()

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API routes
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "healthy",
				"message": "API is running",
			})
		})
		api.POST("/research", handleResearch)
	}

	// Start the server
	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
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
