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
    // const { data, meta, error, loading } = useQuery({
    //     endpoint: `${process.env.NEXT_PUBLIC_TINYBIRD_API_URL}/v0/pipes/log_timeseries.json`,
    //     token: params.token ?? '',
    //     params: {
    //         start_date: params.start_date ?? '',
    //         end_date: params.end_date ?? '',
    //         message: params.message ?? '',
    //         request_path: params.request_path?.join(',') ?? '',
    //         user_agent: params.user_agent?.join(',') ?? '',
    //         status_code: params.status_code?.join(',') ?? '',   
    //         service: params.service?.join(',') ?? '',
    //         level: params.level?.join(',') ?? '',
    //         environment: params.environment?.join(',') ?? '',
    //         request_method: params.request_method?.join(',') ?? '',
    //     }
    //   })
    
    //   if (loading) return <div>Loading...</div>
    //   if (error) return <div>Error: {error}</div>

    //   const option = {
    //     grid: {
    //       left: '0',
    //       right: '0',
    //       bottom: '0',
    //       top: '8',
    //       containLabel: true,
    //     },
    //     tooltip: {
    //         trigger: 'xAxis',
    //         backgroundColor: '#25283D',
    //         borderWidth: 0,
    //         textStyle: {
    //             color: '#FFFFFF',
    //             fontSize: 12,
    //             fontWeight: 'normal',
    //             fontFamily: 'Inter',
    //             lineHeight: 16,
    //         },
    //       },
    //     xAxis: [
    //       {
    //         type: 'category',
    //         boundaryGap: false,
    //         data: data?.map((item: any) => item.date) ?? []
    //       }
    //     ],
    //     yAxis: [
    //       {
    //         type: 'value'
    //       }
    //     ],
    //     series: [
    //       {
    //         name: 'Total Requests',
    //         type: 'bar',
    //         stack: 'Total',
    //         smooth: true,
    //         itemStyle: {
    //           width: 2,
    //           color: '#357AF6'
    //         },
    //         emphasis: {
    //           focus: 'self',
    //           blurScope: "coordinateSystem",
    //           itemStyle: {
    //             color: '#357AF6'
    //           }
    //         },
    //         blur: {
    //           itemStyle: {
    //             color: '#E0EFFF',
    //             opacity: 1
    //          }
    //         },
    //         data: data?.map((item: any) => item.total_requests) ?? []
    //       },
    //       {
    //         name: 'Error Count',
    //         type: 'bar',
    //         stack: 'Total',
    //         smooth: true,
    //         itemStyle: {
    //           color: '#fe5c73'
    //         },
    //         showSymbol: false,
    //         emphasis: {
    //           focus: 'self',
    //           blurScope: "coordinateSystem",
    //           itemStyle: {
    //             color: '#fe5c73'
    //           }
    //         },
    //         blur: {
    //             itemStyle: {
    //               color: '#fdaac1',
    //               opacity: 1
    //            }
    //           },
    //         data: data?.map((item: any) => item.error_count) ?? []
    //       }
    //     ]
    //   };
    
    //   return <ReactECharts option={option} style={{ height: '140px' }} />

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
    colorPalette={['#357AF6', '#fe5b73']}
    options={{
      grid: {
        left: 0,
        right: 0,
        top: 8,
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#25283D',
        borderWidth: 0,
        padding: 12,
        textStyle: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'normal',
            fontFamily: 'Inter',
            lineHeight: 16,
        },
      },
      axisLabel: {
        color: '#9D9EA1',
        fontSize: 12,
        fontWeight: 'semibold',
        fontFamily: 'Inter',
        lineHeight: 16,
      },
    }}
  />
}