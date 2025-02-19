'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";

function formatDate(date: Date) {
  return date.toISOString().split('.')[0].replace('T', ' ').replace('Z', '');
}

const timeRangeLabels: Record<string, string> = {
  '1h': 'Last 1 hour',
  '24h': 'Last 24 hours',
  '3d': 'Last 3 days',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '6m': 'Last 6 months',
};

export function DateRangeSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useDefaultDateRange();

  const handleTimeRangeChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const now = new Date();
    let startDate: Date;

    switch (value) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '3d':
        startDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6m':
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    params.set('start_date', formatDate(startDate));
    params.set('end_date', formatDate(now));
    params.set('time_range', value);
    params.delete('custom_range');
    
    router.replace(`${pathname}?${params.toString()}`);
    window.dispatchEvent(new Event('refresh-filters'));
  }, [pathname, router, searchParams]);

  const isCustomRange = searchParams.get('custom_range') === 'custom';
  const timeRange = searchParams.get('time_range') || "3d";
  const defaultValue = isCustomRange ? 'custom' : timeRange;

  return (
    <Select 
      value={defaultValue}
      onValueChange={handleTimeRangeChange}
    >
      <SelectTrigger className="w-[180px] h-10 bg-white border-[var(--border-gray)]">
        <SelectValue>
          {isCustomRange ? "Custom Range" : timeRangeLabels[timeRange]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1h" className="hover:bg-[var(--background-hover)]">Last 1 hour</SelectItem>
        <SelectItem value="24h" className="hover:bg-[var(--background-hover)]">Last 24 hours</SelectItem>
        <SelectItem value="3d" className="hover:bg-[var(--background-hover)]">Last 3 days</SelectItem>
        <SelectItem value="7d" className="hover:bg-[var(--background-hover)]">Last 7 days</SelectItem>
        <SelectItem value="30d" className="hover:bg-[var(--background-hover)]">Last 30 days</SelectItem>
        <SelectItem value="6m" className="hover:bg-[var(--background-hover)]">Last 6 months</SelectItem>
      </SelectContent>
    </Select>
  );
} 