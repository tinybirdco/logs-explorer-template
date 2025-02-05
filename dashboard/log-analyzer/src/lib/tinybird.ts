import { Tinybird } from '@chronark/zod-bird';
import { z } from 'zod';
import { type DashboardConfig } from "@/config/types";
import dashboardConfig from "@/config/dashboard.json";

const config = dashboardConfig as DashboardConfig;

export const tb = new Tinybird({ baseUrl: process.env.NEXT_PUBLIC_TINYBIRD_API_URL!, token: process.env.NEXT_PUBLIC_TINYBIRD_API_KEY! });

// Helper to convert column type to Zod schema
function getColumnZodType(type: string) {
  switch (type) {
    case 'datetime':
      return z.string();
    case 'badge':
      return z.string().or(z.number());
    default:
      return z.string();
  }
}

// Generate LogEntry schema from table config
export const LogEntrySchema = z.object(
  config.table.columns.reduce((acc, col) => ({
    ...acc,
    [col.key]: getColumnZodType(col.type)
  }), {})
);

export type LogEntry = z.infer<typeof LogEntrySchema>;

// Helper to convert filter type to Zod schema
function getZodType(type: string) {
  switch (type) {
    case 'string[]':
      return z.array(z.string()).optional();
    case 'string':
      return z.string().optional();
    case 'number':
      return z.number().optional();
    default:
      return z.string().optional();
  }
}

// Generate parameters schema from config
function generateParamsSchema(params: DashboardConfig['timeseries']['params']) {
  return z.object({
    page: z.number().optional(),
    page_size: z.number().optional(),
    sort_by: z.string().optional(),
    order: z.string().optional(),
    ...params.reduce((acc, param) => ({
      ...acc,
      [param.name]: getZodType(param.type)
    }), {})
  });
}

// Build API endpoints from config
export const logAnalysisApi = tb.buildPipe({
  pipe: config.endpoints.logs,
  parameters: generateParamsSchema(config.timeseries.params),
  data: LogEntrySchema,
});

export const genericCounterApi = tb.buildPipe({
  pipe: config.endpoints.counter,
  parameters: z.object({
    column_name: z.string(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }),
  data: z.object({
    category: z.string(),
    count: z.number(),
  }),
}); 
