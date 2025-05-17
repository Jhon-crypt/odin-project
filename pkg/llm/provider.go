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
	TokensUsed int
	Model      string
}

// Factory creates a new LLM provider based on the provider name
func NewProvider(providerName string) (Provider, error) {
	switch providerName {
	case "openai":
		apiKey := os.Getenv("OPENAI_API_KEY")
		if apiKey == "" {
			return nil, errors.New("OpenAI API key not found. Please set the OPENAI_API_KEY environment variable with your API key from https://platform.openai.com/api-keys")
		}
		return NewOpenAIProvider(apiKey), nil
	case "gemini":
		return &GeminiProvider{}, nil
	default:
		return nil, errors.New("unsupported provider")
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
	// Create the completion request
	req := openai.ChatCompletionRequest{
		Model:     model,
		MaxTokens: maxTokens,
		Messages: []openai.ChatCompletionMessage{
			{
				Role: openai.ChatMessageRoleSystem,
				Content: `You are a research assistant helping with in-depth analysis and insights. 
				Provide detailed, well-structured responses with citations where possible.`,
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: query,
			},
		},
	}

	// Make the API call
	resp, err := p.client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("OpenAI API error: %w", err)
	}

	if len(resp.Choices) == 0 {
		return nil, errors.New("no response from OpenAI")
	}

	return &ResearchResult{
		Content:    resp.Choices[0].Message.Content,
		TokensUsed: resp.Usage.TotalTokens,
		Model:      model,
	}, nil
}

func (p *OpenAIProvider) StreamResearch(ctx context.Context, query string, model string, maxTokens int, resultChan chan<- string) error {
	defer close(resultChan)

	req := openai.ChatCompletionRequest{
		Model:     model,
		MaxTokens: maxTokens,
		Messages: []openai.ChatCompletionMessage{
			{
				Role: openai.ChatMessageRoleSystem,
				Content: `You are a research assistant helping with in-depth analysis and insights. 
				Provide detailed, well-structured responses with citations where possible.`,
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: query,
			},
		},
		Stream: true,
	}

	stream, err := p.client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		return fmt.Errorf("OpenAI stream error: %w", err)
	}
	defer stream.Close()

	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			return nil
		}
		if err != nil {
			return fmt.Errorf("stream receive error: %w", err)
		}

		if len(response.Choices) > 0 {
			content := response.Choices[0].Delta.Content
			if content != "" {
				resultChan <- content
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
