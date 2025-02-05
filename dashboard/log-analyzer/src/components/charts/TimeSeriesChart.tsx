'use client'

import { BarChart } from '@tinybirdco/charts'

export function TimeSeriesChart(params: {
  token?: string
  start_date?: string
  end_date?: string
  message?: string
  request_path?: string[]
  user_agent?: string[]
  status_code?: string[]
  service?: string[]
  level?: string[]
  environment?: string[]
  request_method?: string[]
}) {
  return <BarChart 
    endpoint={`${process.env.NEXT_PUBLIC_TINYBIRD_API_URL}/v0/pipes/log_timeseries.json`}
    token={params.token ?? ''}
    index="date"
    categories={['total_requests', 'error_count']}
    height="140px"
    params={{
      ...params,
      request_path: params.request_path?.join(',') ?? '',
      user_agent: params.user_agent?.join(',') ?? '',
      status_code: params.status_code?.join(',') ?? '',
      service: params.service?.join(',') ?? '',
      level: params.level?.join(',') ?? '',
      environment: params.environment?.join(',') ?? '',
      request_method: params.request_method?.join(',') ?? '',
      message: params.message ?? '',
    }}
    stacked={true}
    colorPalette={['#000000', '#ff0000']}
  />
}