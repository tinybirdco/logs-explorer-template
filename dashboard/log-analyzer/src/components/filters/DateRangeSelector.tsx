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
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    params.set('start_date', formatDate(startDate));
    params.set('end_date', formatDate(now));
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <Select defaultValue="7d" onValueChange={handleTimeRangeChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Time Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="30m">Last 30 minutes</SelectItem>
        <SelectItem value="1h">Last 1 hour</SelectItem>
        <SelectItem value="24h">Last 24 hours</SelectItem>
        <SelectItem value="7d">Last 7 days</SelectItem>
      </SelectContent>
    </Select>
  );
} 