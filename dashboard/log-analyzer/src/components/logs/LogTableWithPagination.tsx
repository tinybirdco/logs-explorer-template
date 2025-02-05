'use client';

import { useCallback, useState, useEffect } from 'react';
import { LogTable } from "./LogTable";
import type { LogEntry } from "@/lib/types";
import { Loader2 } from 'lucide-react';
import { logAnalysisApi } from '@/lib/tinybird';
import { useSearchParams } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface LogTableWithPaginationProps {
  pageSize: number;
}

export function LogTableWithPagination({ pageSize }: LogTableWithPaginationProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();

  const getFilters = useCallback(() => {
    const filters = {
      service: searchParams.get('service')?.split(',').filter(Boolean) || undefined,
      level: searchParams.get('level')?.split(',').filter(Boolean) || undefined,
      environment: searchParams.get('environment')?.split(',').filter(Boolean) || undefined,
      request_method: searchParams.get('request_method')?.split(',').filter(Boolean) || undefined,
      status_code: searchParams.get('status_code')?.split(',').filter(Boolean)?.map(Number) || undefined,
      request_path: searchParams.get('request_path')?.split(',').filter(Boolean) || undefined,
      user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean) || undefined,
    };

    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value && value.length > 0)
    );
  }, [searchParams]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await logAnalysisApi({ 
          ...getFilters(),
          page: 0,
          page_size: pageSize,
        });
        
        setLogs(response.data || []);
        setPage(0);
        setHasMore(response.data?.length === pageSize);
      } catch (error) {
        console.error('Error loading logs:', error);
        setHasMore(false);
      }
    };

    loadInitialData();
  }, [searchParams, pageSize, getFilters]);

  const loadMore = useCallback(async (setIsLoading: (loading: boolean) => void) => {
    if (!hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      console.log('Loading page:', nextPage);
      
      const response = await logAnalysisApi({ 
        ...getFilters(),
        page: nextPage,
        page_size: pageSize,
      });

      if (!response.data?.length) {
        setHasMore(false);
      } else {
        setLogs(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(response.data.length === pageSize);
      }
    } catch (error) {
      console.error('Error loading more logs:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, pageSize, getFilters]);

  const { observerRef, isLoading } = useInfiniteScroll(
    () => loadMore(setIsLoading => setIsLoading)
  );

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto">
      <LogTable logs={logs} />
      <div 
        ref={observerRef} 
        className="h-20 w-full flex items-center justify-center"
      >
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
} 