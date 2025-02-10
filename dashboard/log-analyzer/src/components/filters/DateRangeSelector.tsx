'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";

function formatDate(date: Date) {
  return date.toISOString().split('.')[0].replace('T', ' ').replace('Z', '');
}

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
      case '30m':
        startDate = new Date(now.getTime() - 30 * 60 * 1000);
        break;
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        startDate = new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000);
        break;
      case '6m':
        startDate = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    params.set('start_date', formatDate(startDate));
    params.set('end_date', formatDate(now));
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <Select defaultValue="7d" onValueChange={handleTimeRangeChange}>
      <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200">
        <SelectValue placeholder="Time Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="30m" className="hover:bg-[var(--background-hover)]">Last 30 minutes</SelectItem>
        <SelectItem value="1h" className="hover:bg-[var(--background-hover)]">Last 1 hour</SelectItem>
        <SelectItem value="24h" className="hover:bg-[var(--background-hover)]">Last 24 hours</SelectItem>
        <SelectItem value="7d" className="hover:bg-[var(--background-hover)]">Last 7 days</SelectItem>
        <SelectItem value="30d" className="hover:bg-[var(--background-hover)]">Last 30 days</SelectItem>
        <SelectItem value="3m" className="hover:bg-[var(--background-hover)]">Last 3 months</SelectItem>
        <SelectItem value="6m" className="hover:bg-[var(--background-hover)]">Last 6 months</SelectItem>
        <SelectItem value="1y" className="hover:bg-[var(--background-hover)]">Last 1 year</SelectItem>
      </SelectContent>
    </Select>
  );
} 