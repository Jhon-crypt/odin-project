package llm

import (
	"context"
	"errors"
)

// Provider defines the interface for LLM providers
type Provider interface {
	Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error)
}

// ResearchResult represents the response from an LLM provider
type ResearchResult struct {
	Content    string
	TokensUsed int
	Model      string
}

// Factory creates a new LLM provider based on the provider name
func NewProvider(providerName string) (Provider, error) {
	switch providerName {
	case "openai":
		return &OpenAIProvider{}, nil
	case "gemini":
		return &GeminiProvider{}, nil
	default:
		return nil, errors.New("unsupported provider")
	}
}

// OpenAIProvider implements the Provider interface for OpenAI
type OpenAIProvider struct{}

func (p *OpenAIProvider) Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error) {
	// TODO: Implement OpenAI API call
	// This is where you would make the actual API call to OpenAI
	return &ResearchResult{
		Content:    "OpenAI research results will be implemented here",
		TokensUsed: 0,
		Model:      model,
	}, nil
}

// GeminiProvider implements the Provider interface for Google's Gemini
type GeminiProvider struct{}

func (p *GeminiProvider) Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error) {
	// TODO: Implement Gemini API call
	// This is where you would make the actual API call to Gemini
	return &ResearchResult{
		Content:    "Gemini research results will be implemented here",
		TokensUsed: 0,
		Model:      model,
	}, nil
}
