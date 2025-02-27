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
    tenant_name: searchParams.get('tenant_name')?.split(',').filter(Boolean),
    client_name: searchParams.get('client_name')?.split(',').filter(Boolean),
    user_name: searchParams.get('user_name')?.split(',').filter(Boolean),
    user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean),
    hostname: searchParams.get('hostname')?.split(',').filter(Boolean),
    description: searchParams.get('description') ?? '',
    connection: searchParams.get('connection')?.split(',').filter(Boolean),
    strategy: searchParams.get('strategy')?.split(',').filter(Boolean),
    strategy_type: searchParams.get('strategy_type')?.split(',').filter(Boolean),
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