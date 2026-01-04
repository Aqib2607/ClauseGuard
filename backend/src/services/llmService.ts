import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { logger } from '../config/logger';
import { LLMResponse } from '../types';
import { CLAUSE_EXTRACTION_PROMPT, CONTRACT_GENERATION_PROMPT } from '../prompts/contractAnalysis';

export class LLMService {
  private client: Anthropic;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.llm.apiKey,
    });
  }

  async analyzeContract(contractText: string): Promise<LLMResponse> {
    const prompt = `${CLAUSE_EXTRACTION_PROMPT}\n\n${contractText}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info('Calling Claude API for contract analysis', { attempt });

        const message = await this.client.messages.create({
          model: config.llm.model,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

        const parsed = this.parseAnalysisResponse(responseText);
        logger.info('Contract analysis completed successfully');
        return parsed;
      } catch (error) {
        lastError = error as Error;
        logger.error('Claude API call failed', { attempt, error });

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          logger.info('Retrying after delay', { delayMs: delay });
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Failed to analyze contract after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  async generateContract(templateData: Record<string, any>): Promise<string> {
    const prompt = `${CONTRACT_GENERATION_PROMPT}\n\n${JSON.stringify(templateData, null, 2)}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.info('Calling Claude API for contract generation', { attempt });

        const message = await this.client.messages.create({
          model: config.llm.model,
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
        logger.info('Contract generation completed successfully');
        return responseText;
      } catch (error) {
        lastError = error as Error;
        logger.error('Claude API call failed', { attempt, error });

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Failed to generate contract after ${this.maxRetries} attempts: ${lastError?.message}`);
  }

  private parseAnalysisResponse(responseText: string): LLMResponse {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!parsed.summary || !Array.isArray(parsed.summary)) {
        throw new Error('Invalid response format: missing summary array');
      }

      if (!parsed.riskClauses || !Array.isArray(parsed.riskClauses)) {
        throw new Error('Invalid response format: missing riskClauses array');
      }

      return {
        summary: parsed.summary.slice(0, 5),
        riskClauses: parsed.riskClauses.map((clause: any) => ({
          text: clause.text || '',
          riskLevel: clause.riskLevel || 'medium',
          explanation: clause.explanation || '',
          section: clause.section,
        })),
      };
    } catch (error) {
      logger.error('Failed to parse LLM response', { error, responseText });
      throw new Error('Failed to parse AI response');
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
