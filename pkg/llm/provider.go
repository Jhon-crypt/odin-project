package llm

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

// Provider defines the interface for LLM providers
type Provider interface {
	Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error)
	StreamResearch(ctx context.Context, query string, model string, maxTokens int, resultChan chan<- string) error
}

// ResearchResult represents the response from an LLM provider
type ResearchResult struct {
	Content    string
	Model      string
	TokensUsed int
}

// Factory creates a new LLM provider based on the provider name
func NewProvider(providerType string) (Provider, error) {
	switch providerType {
	case "openai":
		apiKey := os.Getenv("OPENAI_API_KEY")
		if apiKey == "" {
			return nil, errors.New("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable with your API key from https://platform.openai.com/api-keys")
		}
		return NewOpenAIProvider(apiKey), nil
	case "gemini":
		return nil, errors.New("Gemini provider not implemented yet")
	default:
		return nil, fmt.Errorf("unknown provider type: %s", providerType)
	}
}

// OpenAIProvider implements the Provider interface for OpenAI
type OpenAIProvider struct {
	client *openai.Client
}

func NewOpenAIProvider(apiKey string) *OpenAIProvider {
	return &OpenAIProvider{
		client: openai.NewClient(apiKey),
	}
}

func (p *OpenAIProvider) Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error) {
	resp, err := p.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: query,
				},
			},
			MaxTokens: maxTokens,
		},
	)

	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %v", err)
	}

	if len(resp.Choices) == 0 {
		return nil, errors.New("no response from OpenAI")
	}

	return &ResearchResult{
		Content:    resp.Choices[0].Message.Content,
		Model:      resp.Model,
		TokensUsed: resp.Usage.TotalTokens,
	}, nil
}

func (p *OpenAIProvider) StreamResearch(ctx context.Context, query string, model string, maxTokens int, resultChan chan<- string) error {
	defer close(resultChan)

	stream, err := p.client.CreateChatCompletionStream(
		ctx,
		openai.ChatCompletionRequest{
			Model: model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: query,
				},
			},
			MaxTokens: maxTokens,
			Stream:    true,
		},
	)
	if err != nil {
		return fmt.Errorf("OpenAI stream error: %v", err)
	}
	defer stream.Close()

	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return fmt.Errorf("stream receive error: %v", err)
		}

		if len(response.Choices) > 0 {
			chunk := response.Choices[0].Delta.Content
			if chunk != "" {
				select {
				case resultChan <- chunk:
				case <-ctx.Done():
					return ctx.Err()
				}
			}
		}
	}
}

// GeminiProvider implements the Provider interface for Google's Gemini
type GeminiProvider struct{}

func (p *GeminiProvider) Research(ctx context.Context, query string, model string, maxTokens int) (*ResearchResult, error) {
	// TODO: Implement Gemini API call
	return &ResearchResult{
		Content:    "Gemini research results will be implemented here",
		TokensUsed: 0,
		Model:      model,
	}, nil
}

func (p *GeminiProvider) StreamResearch(ctx context.Context, query string, model string, maxTokens int, resultChan chan<- string) error {
	defer close(resultChan)
	// TODO: Implement Gemini streaming
	resultChan <- "Gemini streaming will be implemented here"
	return nil
}
