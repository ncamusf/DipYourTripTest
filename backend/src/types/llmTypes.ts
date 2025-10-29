export interface LLMResponse {
    content: string;
    model: string;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
  }
  
  export interface LLMRequestOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  }
  
  export interface AnthropicAPIResponse {
    content: Array<{ text: string }>;
    model: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
  }