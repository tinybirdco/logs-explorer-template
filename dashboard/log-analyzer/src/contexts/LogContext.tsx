'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import { logAnalysisApi } from '@/lib/tinybird';
import { LogEntry } from '@/lib/types';

interface LogContextType {
  logs: LogEntry[];
  isLoading: boolean;
  error: string | null;
  fetchLogs: (filters: LogFilters) => Promise<void>;
}

interface LogFilters {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  service?: string[];
  level?: string[];
  environment?: string[];
  request_method?: string[];
  status_code?: number[];
  request_path?: string[];
  user_agent?: string[];
}

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (filters: LogFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await logAnalysisApi({
        page: filters.page ?? 0,
        page_size: filters.page_size || 100,
        start_date: filters.start_date,
        end_date: filters.end_date,
        service: filters.service,
        level: filters.level,
        environment: filters.environment,
        request_method: filters.request_method,
        status_code: filters.status_code,
        request_path: filters.request_path,
        user_agent: filters.user_agent,
      });

      setLogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <LogContext.Provider value={{ logs, isLoading, error, fetchLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
} 