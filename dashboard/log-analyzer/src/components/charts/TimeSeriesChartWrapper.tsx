'use client';

import { useSearchParams } from "next/navigation";
import { TimeSeriesChart, type TimeSeriesChartProps } from "@/components/charts/TimeSeriesChart";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";
import { type DashboardConfig } from "@/config/types";
import dashboardConfig from "@/config/dashboard.json";

const config = dashboardConfig as DashboardConfig;

type TimeSeriesParams = {
  token: string | undefined;
  start_date: string;
  end_date: string;
  endpoint: string;
  index: string;
  categories: string[];
  height: string;
  colorPalette: string[];
  [key: string]: string | string[] | undefined;
};

interface TimeSeriesChartWrapperProps {
  token: string | undefined;
}

export function TimeSeriesChartWrapper({ token }: TimeSeriesChartWrapperProps) {
  const searchParams = useSearchParams();
  useDefaultDateRange();

  if (!token) {
    return <div className="flex items-center justify-center h-full">
      Missing API token
    </div>;
  }

  const params = {
    token,
    endpoint: config.timeseries.endpoint,
    index: config.timeseries.index,
    categories: config.timeseries.categories,
    height: config.timeseries.height,
    colorPalette: config.timeseries.colorPalette,
  } as TimeSeriesParams;

  // Add dynamic params from URL based on config
  config.timeseries.params.forEach(param => {
    const value = searchParams.get(param.name);
    if (value) {
      params[param.name] = param.type === 'string[]' ? value.split(',').filter(Boolean) : value;
    }
  });

  return <TimeSeriesChart {...params as TimeSeriesChartProps} />;
} 