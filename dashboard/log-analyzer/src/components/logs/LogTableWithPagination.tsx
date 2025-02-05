'use client';

import { useCallback, useState, useEffect } from 'react';
import { LogTable } from "./LogTable";
import type { LogEntry } from "@/lib/tinybird";
import { Loader2 } from 'lucide-react';
import { logAnalysisApi } from '@/lib/tinybird';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";
import { getFiltersFromParams } from "@/lib/filters";

interface LogTableWithPaginationProps {
  pageSize: number;
}

export function LogTableWithPagination({ pageSize }: LogTableWithPaginationProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSortColumn = searchParams.get('sort_by');
  const currentSortOrder = searchParams.get('order') as 'asc' | 'desc' | null;

  const getFilters = useCallback(() => {
    return getFiltersFromParams(searchParams, {
      sort_by: currentSortColumn || undefined,
      order: currentSortOrder || undefined
    });
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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await logAnalysisApi({ 
          ...getFilters(),
          page: 0,
          page_size: pageSize,
          sort_by: currentSortColumn || undefined,
          order: currentSortOrder || undefined,
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
  }, [searchParams, pageSize, getFilters, currentSortColumn, currentSortOrder]);

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
        sort_by: currentSortColumn || undefined,
        order: currentSortOrder || undefined,
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
  }, [page, hasMore, pageSize, getFilters, currentSortColumn, currentSortOrder]);

  const { observerRef, isLoading } = useInfiniteScroll(
    () => loadMore(setIsLoading => setIsLoading)
  );

  useDefaultDateRange();

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto">
      <LogTable 
        logs={logs} 
        onSort={handleSort}
        sortColumn={currentSortColumn || undefined}
        sortOrder={currentSortOrder || undefined}
      />
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