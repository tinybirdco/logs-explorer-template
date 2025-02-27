import { z } from 'zod';

export const LogEntrySchema = z.object({
  request_id: z.string(),
  timestamp: z.string(),
  request_method: z.string(),
  status_code: z.number(),
  projectName: z.string(),
  request_path: z.string(),
  level: z.string(),
  message: z.string(),
  environment: z.string(),
});

export type LogEntry = z.infer<typeof LogEntrySchema>;

// This is what zod-bird will return in the .data property
export const LogAnalysisResponseSchema = LogEntrySchema;

export type LogAnalysisResponse = z.infer<typeof LogAnalysisResponseSchema>;
