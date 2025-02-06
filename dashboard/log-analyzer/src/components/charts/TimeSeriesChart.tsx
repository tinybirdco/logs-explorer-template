'use client'

import { BarChart } from '@tinybirdco/charts'

export type TimeSeriesChartProps = {
  token: string;
  endpoint: string;
  index: string;
  categories: string[];
  height: string;
  colorPalette: string[];
  [key: string]: string | string[] | undefined;
}

export function TimeSeriesChart(params: TimeSeriesChartProps) {
  // Convert array parameters to comma-separated strings
  const processedParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = Array.isArray(value) ? value.join(',') : value;
    }
    return acc;
  }, {} as Record<string, string>);

  return <BarChart 
    endpoint={process.env.NEXT_PUBLIC_TINYBIRD_API_URL + params.endpoint}
    token={params.token}
    index={params.index}
    categories={params.categories}
    height={params.height}
    colorPalette={params.colorPalette}
    stacked={true}
    params={processedParams}
  />
}