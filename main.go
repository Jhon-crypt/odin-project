package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"

	"odin-project/pkg/llm"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type ResearchRequest struct {
	Provider  string `json:"provider"`  // "openai" or "gemini"
	Model     string `json:"model"`     // e.g. "gpt-4.1-2025-04-14"
	Query     string `json:"query"`     // The research query
	MaxTokens int    `json:"maxTokens"` // Maximum tokens for response
}

type ResearchResponse struct {
	Result     string `json:"result"`
	Provider   string `json:"provider"`
	Model      string `json:"model"`
	TokensUsed int    `json:"tokensUsed"`
}

func handleResearch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ResearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Provider == "" || req.Model == "" || req.Query == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Create LLM provider
	provider, err := llm.NewProvider(req.Provider)
	if err != nil {
		http.Error(w, "Invalid provider: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Set default max tokens if not provided
	if req.MaxTokens == 0 {
		req.MaxTokens = 2000
	}

	// Perform research using the provider
	result, err := provider.Research(r.Context(), req.Query, req.Model, req.MaxTokens)
	if err != nil {
		http.Error(w, "Research failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := ResearchResponse{
		Result:     result.Content,
		Provider:   req.Provider,
		Model:      result.Model,
		TokensUsed: result.TokensUsed,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

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
		api.POST("/research", func(c *gin.Context) {
			handleResearch(c.Writer, c.Request)
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
