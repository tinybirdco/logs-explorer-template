'use client';

import { useSearchParams } from "next/navigation";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";

interface TimeSeriesChartWrapperProps {
  token: string | undefined;
  start_date: string;
  end_date: string;
}

export function TimeSeriesChartWrapper(props: TimeSeriesChartWrapperProps) {
  const searchParams = useSearchParams();
  
  const params = {
    ...props,
    service: searchParams.get('service')?.split(',').filter(Boolean),
    level: searchParams.get('level')?.split(',').filter(Boolean),
    environment: searchParams.get('environment')?.split(',').filter(Boolean),
    request_method: searchParams.get('request_method')?.split(',').filter(Boolean),
    status_code: searchParams.get('status_code')?.split(',').filter(Boolean),
    request_path: searchParams.get('request_path')?.split(',').filter(Boolean),
    user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean),
  };

  return <TimeSeriesChart {...params} />;
} 