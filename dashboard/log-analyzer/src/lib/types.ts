import { z } from 'zod';

export const LogEntrySchema = z.object({
  log_id: z.string(),
  timestamp: z.string(),
  tenant_name: z.string(),
  client_name: z.string(),
  user_name: z.string(),
  user_agent: z.string(),
  hostname: z.string(),
  description: z.string(),
  connection: z.string(),
  strategy: z.string(),
  strategy_type: z.string(),
  data: z.string(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

// This is what zod-bird will return in the .data property
export const LogAnalysisResponseSchema = LogEntrySchema;

export type LogAnalysisResponse = z.infer<typeof LogAnalysisResponseSchema>;
