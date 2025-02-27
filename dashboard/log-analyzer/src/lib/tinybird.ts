import { Tinybird } from '@chronark/zod-bird';
import { LogAnalysisResponseSchema } from './types';
import { z } from 'zod';

export const tb = new Tinybird({ baseUrl: process.env.NEXT_PUBLIC_TINYBIRD_API_URL!, token: process.env.NEXT_PUBLIC_TINYBIRD_API_KEY! });

export const logAnalysisApi = tb.buildPipe({
  pipe: 'log_analysis',
  parameters: z.object({
    page: z.number(),
    page_size: z.number(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    tenant_name: z.array(z.string()).optional(),
    client_name: z.array(z.string()).optional(),
    user_name: z.array(z.string()).optional(),
    user_agent: z.array(z.string()).optional(),
    hostname: z.array(z.string()).optional(),
    description: z.array(z.string()).optional(),
    connection: z.array(z.string()).optional(),
    strategy: z.array(z.string()).optional(),
    strategy_type: z.array(z.string()).optional(),
    sort_by: z.string().optional(),
    order: z.string().optional(),
  }),
  data: LogAnalysisResponseSchema,
});

export const logExplorerApi = tb.buildPipe({
  pipe: 'log_explorer',
  parameters: z.object({
    page: z.number(),
    page_size: z.number(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    tenant_name: z.array(z.string()).optional(),
    client_name: z.array(z.string()).optional(),
    user_name: z.array(z.string()).optional(),
    user_agent: z.array(z.string()).optional(),
    hostname: z.array(z.string()).optional(),
    description: z.array(z.string()).optional(),
    connection: z.array(z.string()).optional(),
    strategy: z.array(z.string()).optional(),
    strategy_type: z.array(z.string()).optional(),
    sort_by: z.string().optional(),
    order: z.string().optional(),
  }),
  data: LogAnalysisResponseSchema,
});

export const genericCounterApi = tb.buildPipe({
  pipe: 'generic_counter',
  parameters: z.object({
    column_name: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    tenant_name: z.array(z.string()).optional(),
    client_name: z.array(z.string()).optional(),
    user_name: z.array(z.string()).optional(),
    user_agent: z.array(z.string()).optional(),
    hostname: z.array(z.string()).optional(),
    description: z.array(z.string()).optional(),
    connection: z.array(z.string()).optional(),
    strategy: z.array(z.string()).optional(),
    strategy_type: z.array(z.string()).optional(),
    __tb__deployment: z.string().optional(),
  }),
  data: z.object({
    category: z.string(),
    count: z.number(),
  }),
}); 