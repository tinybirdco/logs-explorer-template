'use client';

import { useSearchParams } from "next/navigation";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { useRouter } from "next/navigation";
import { useTinybirdToken } from "@/app/providers/TinybirdProvider";
import { subDays, format } from "date-fns";

export function TimeSeriesChartWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useTinybirdToken();
  
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  // Default to last 3 days if no dates present
  const defaultEndDate = new Date();
  const defaultStartDate = subDays(defaultEndDate, 3);
  
  const params = {
    token,
    start_date: start_date || format(defaultStartDate, 'yyyy-MM-dd HH:mm:ss'),
    end_date: end_date || format(defaultEndDate, 'yyyy-MM-dd HH:mm:ss'),
    service: searchParams.get('service')?.split(',').filter(Boolean),
    level: searchParams.get('level')?.split(',').filter(Boolean),
    environment: searchParams.get('environment')?.split(',').filter(Boolean),
    request_method: searchParams.get('request_method')?.split(',').filter(Boolean),
    status_code: searchParams.get('status_code')?.split(',').filter(Boolean),
    request_path: searchParams.get('request_path')?.split(',').filter(Boolean),
    user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean),
    message: searchParams.get('message') ?? '',
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <TimeSeriesChart {...params}
      onDateRangeSelect={(start, end) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('start_date', start);
        params.set('end_date', end);
        params.set('custom_range', 'custom');
        router.push(`?${params.toString()}`);
      }} />
    </div>
  );
} 