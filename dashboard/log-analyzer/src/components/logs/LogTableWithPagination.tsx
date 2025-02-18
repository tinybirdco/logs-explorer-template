'use client';

import { useCallback, useState, useEffect } from 'react';
import { LogTable } from "./LogTable";
import type { LogEntry } from "@/lib/types";
import { logAnalysisApi, logExplorerApi } from '@/lib/tinybird';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";

interface LogTableWithPaginationProps {
  pageSize: number;
}

export function LogTableWithPagination({ pageSize }: LogTableWithPaginationProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSortColumn = searchParams.get('sort_by');
  const currentSortOrder = searchParams.get('order') as 'asc' | 'desc' | null;

  const getFilters = useCallback(() => {
    const filters = {
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      service: searchParams.get('service')?.split(',').filter(Boolean) || undefined,
      level: searchParams.get('level')?.split(',').filter(Boolean) || undefined,
      environment: searchParams.get('environment')?.split(',').filter(Boolean) || undefined,
      request_method: searchParams.get('request_method')?.split(',').filter(Boolean) || undefined,
      status_code: searchParams.get('status_code')?.split(',').filter(Boolean)?.map(Number) || undefined,
      request_path: searchParams.get('request_path')?.split(',').filter(Boolean) || undefined,
      user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean) || undefined,
      message: searchParams.get('message') || undefined,
      sort_by: currentSortColumn || undefined,
      order: currentSortOrder || undefined,
    };

    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value && value.length > 0)
    );
  }, [searchParams, currentSortColumn, currentSortOrder]);

  const handleSort = useCallback((column: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    let newOrder: 'asc' | 'desc' = 'asc';
    if (currentSortColumn === column && currentSortOrder === 'asc') {
      newOrder = 'desc';
    }

    params.set('sort_by', column);
    params.set('order', newOrder);
    params.delete('page'); // Reset pagination when sorting
    
    router.push(`?${params.toString()}`);
  }, [searchParams, currentSortColumn, currentSortOrder, router]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shouldUseExplorerApi = useCallback((filters: Record<string, any>) => {
    const allowedFilters = ['start_date', 'end_date', 'environment', 'service', 'level', 'order', 'sort_by'];
    const activeFilters = Object.keys(filters);
    return activeFilters.every(filter => allowedFilters.includes(filter));
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const filters = getFilters();
        const api = shouldUseExplorerApi(filters) ? logExplorerApi : logAnalysisApi;
        
        const response = await api({ 
          ...filters,
          page: 0,
          page_size: pageSize,
          sort_by: currentSortColumn || undefined,
          order: currentSortOrder || undefined,
        });
        
        setLogs(response.data || []);
        setPage(0);
        setHasMore(true);
      } catch (error) {
        console.error('Error loading logs:', error);
        setHasMore(false);
      }
    };

    loadInitialData();
  }, [searchParams, pageSize, getFilters, currentSortColumn, currentSortOrder, shouldUseExplorerApi]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      console.log('Loading page:', nextPage);
      
      const filters = getFilters();
      const api = shouldUseExplorerApi(filters) ? logExplorerApi : logAnalysisApi;

      const response = await api({ 
        ...filters,
        page: nextPage,
        page_size: pageSize,
        sort_by: currentSortColumn || undefined,
        order: currentSortOrder || undefined,
      });

      if (!response.data?.length) {
        setHasMore(false);
      } else {
        setLogs(prev => [...prev, ...response.data]);
        setPage(nextPage);
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error loading more logs:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, pageSize, getFilters, currentSortColumn, currentSortOrder, shouldUseExplorerApi]);

  const { observerRef } = useInfiniteScroll(loadMore);

  useDefaultDateRange();

  return (
    <div className="h-[calc(100vh-64px)] p-6">
      <LogTable 
        logs={logs} 
        onSort={handleSort}
        sortColumn={currentSortColumn || undefined}
        sortOrder={currentSortOrder || undefined}
        observerRef={observerRef}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </div>
  );
} 