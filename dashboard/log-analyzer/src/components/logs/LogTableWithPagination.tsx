'use client';

import { useCallback, useState, useEffect } from 'react';
import { LogTable } from "./LogTable";
import type { LogEntry } from "@/lib/types";
import { logAnalysisApi, logExplorerApi } from '@/lib/tinybird';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getTotalRowCount } from "@/lib/utils";
import { Info } from "lucide-react";

interface LogTableWithPaginationProps {
  pageSize: number;
}

export function LogTableWithPagination({ pageSize }: LogTableWithPaginationProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSortColumn = searchParams.get('sort_by');
  const currentSortOrder = searchParams.get('order') as 'asc' | 'desc' | null;

  const getFilters = useCallback(() => {
    const filters = {
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      projectName: searchParams.get('projectName')?.split(',').filter(Boolean) || undefined,
      level: searchParams.get('level')?.split(',').filter(Boolean) || undefined,
      environment: searchParams.get('environment')?.split(',').filter(Boolean) || undefined,
      request_method: searchParams.get('request_method')?.split(',').filter(Boolean) || undefined,
      status_code: searchParams.get('status_code')?.split(',').filter(Boolean)?.map(Number) || undefined,
      request_path: searchParams.get('request_path')?.split(',').filter(Boolean) || undefined,
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
  const shouldUseExplorerApi = useCallback(async (filters: Record<string, any>) => {
    // First check if only allowed filters are being used
    const allowedFilters = ['start_date', 'end_date', 'environment', 'projectName', 'level', 'order', 'sort_by'];
    const activeFilters = Object.keys(filters);
    const onlyAllowedFilters = activeFilters.every(filter => allowedFilters.includes(filter));
    
    if (!onlyAllowedFilters) return false;
    
    // Then check row count
    const totalCount = await getTotalRowCount(filters);
    return totalCount >= 10_000_000;
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const filters = getFilters();
        const useExplorer = await shouldUseExplorerApi(filters);
        const api = useExplorer ? logExplorerApi : logAnalysisApi;
        
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
        setError(error instanceof Error ? error.message : 'An error occurred while loading logs');
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams, pageSize, getFilters, currentSortColumn, currentSortOrder, shouldUseExplorerApi]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      
      const filters = getFilters();
      const useExplorer = await shouldUseExplorerApi(filters);
      const api = useExplorer ? logExplorerApi : logAnalysisApi;

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
      setError(error instanceof Error ? error.message : 'An error occurred while loading more logs');
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, hasMore, isLoading, pageSize, getFilters, currentSortColumn, currentSortOrder, shouldUseExplorerApi]);

  const { observerRef } = useInfiniteScroll(loadMore);

  if (error) {
    return (
      <div className="h-full p-6">
        <div className="h-full flex flex-col items-center justify-center gap-4 bg-white rounded-[4px]">
          <Info className="h-10 w-10 text-[var(--error)]" />
          <span className="text-[var(--error)] text-base font-semibold">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <LogTable 
        logs={logs} 
        onSort={handleSort}
        sortColumn={currentSortColumn || undefined}
        sortOrder={currentSortOrder || undefined}
        observerRef={observerRef}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />
    </div>
  );
} 