'use client';

import { useSearchParams } from "next/navigation";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { useRouter } from "next/navigation";

interface TimeSeriesChartWrapperProps {
  token: string | undefined;
}

export function TimeSeriesChartWrapper(props: TimeSeriesChartWrapperProps) {
  const searchParams = useSearchParams();
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const router = useRouter();

  if (!start_date || !end_date) {
    return null;
  }

  const params = {
    ...props,
    start_date,
    end_date,
    service: searchParams.get('service')?.split(',').filter(Boolean),
    level: searchParams.get('level')?.split(',').filter(Boolean),
    environment: searchParams.get('environment')?.split(',').filter(Boolean),
    request_method: searchParams.get('request_method')?.split(',').filter(Boolean),
    status_code: searchParams.get('status_code')?.split(',').filter(Boolean),
    request_path: searchParams.get('request_path')?.split(',').filter(Boolean),
    host: searchParams.get('host')?.split(',').filter(Boolean),
    path: searchParams.get('path')?.split(',').filter(Boolean),
    resource: searchParams.get('resource')?.split(',').filter(Boolean),
    request_type: searchParams.get('request_type')?.split(',').filter(Boolean),
    vercel_cache: searchParams.get('vercel_cache')?.split(',').filter(Boolean),
    branch: searchParams.get('branch')?.split(',').filter(Boolean),
    deployment_id: searchParams.get('deployment_id')?.split(',').filter(Boolean),
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