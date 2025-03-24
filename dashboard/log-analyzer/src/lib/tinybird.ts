import { Tinybird } from '@chronark/zod-bird';
import { LogAnalysisResponseSchema } from './types';
import { z } from 'zod';

// Create a function to get a Tinybird instance with the current token
export const getTinybird = (token: string) => {
  return new Tinybird({ 
    baseUrl: process.env.NEXT_PUBLIC_TINYBIRD_API_URL!, 
    token 
  });
};

// Create API builders that take a token parameter
export const createLogAnalysisApi = (token: string) => {
  const tb = getTinybird(token);
  return tb.buildPipe({
    pipe: 'log_analysis',
    parameters: z.object({
      page: z.number(),
      page_size: z.number(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      service: z.array(z.string()).optional(),
      level: z.array(z.string()).optional(),
      environment: z.array(z.string()).optional(),
      request_method: z.array(z.string()).optional(),
      status_code: z.array(z.number()).optional(),
      request_path: z.array(z.string()).optional(),
      user_agent: z.array(z.string()).optional(),
      message: z.string().optional(),
      sort_by: z.string().optional(),
      order: z.string().optional(),
    }),
    data: LogAnalysisResponseSchema,
  });
};

export const createLogExplorerApi = (token: string) => {
  const tb = getTinybird(token);
  return tb.buildPipe({
    pipe: 'log_explorer',
    parameters: z.object({
      page: z.number(),
      page_size: z.number(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      service: z.array(z.string()).optional(),
      level: z.array(z.string()).optional(),
      environment: z.array(z.string()).optional(),
      request_method: z.array(z.string()).optional(),
      status_code: z.array(z.number()).optional(),
      request_path: z.array(z.string()).optional(),
      user_agent: z.array(z.string()).optional(),
      message: z.string().optional(),
      sort_by: z.string().optional(),
      order: z.string().optional(),
    }),
    data: LogAnalysisResponseSchema,
  });
};

export const createGenericCounterApi = (token: string) => {
  const tb = getTinybird(token);
  return tb.buildPipe({
    pipe: 'generic_counter',
    parameters: z.object({
      column_name: z.string(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      service: z.array(z.string()).optional(),
      level: z.array(z.string()).optional(),
      environment: z.array(z.string()).optional(),
      request_method: z.array(z.string()).optional(),
      status_code: z.array(z.number()).optional(),
      request_path: z.array(z.string()).optional(),
      user_agent: z.array(z.string()).optional(),
      __tb__deployment: z.string().optional(),
    }),
    data: z.object({
      category: z.string(),
      count: z.number(),
    }),
  });
}; 