'use client'

import { useQuery } from '@tinybirdco/charts'
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import { LoaderIcon } from '../icons';
import { Info } from "lucide-react";
const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

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
  onDateRangeSelect?: (start: string, end: string) => void
}) {
    const { data, error, loading } = useQuery({
        endpoint: `${process.env.NEXT_PUBLIC_TINYBIRD_API_URL}/v0/pipes/log_timeseries.json`,
        token: params.token ?? '',
        params: {
            start_date: params.start_date ?? '',
            end_date: params.end_date ?? '',
            message: params.message ?? '',
            request_path: params.request_path?.join(',') ?? '',
            user_agent: params.user_agent?.join(',') ?? '',
            status_code: params.status_code?.join(',') ?? '',   
            service: params.service?.join(',') ?? '',
            level: params.level?.join(',') ?? '',
            environment: params.environment?.join(',') ?? '',
            request_method: params.request_method?.join(',') ?? '',
        }
      })
    
      if (loading) {
        return (
          <div className="h-[160px] flex items-center justify-center gap-2 bg-[#D9D9D9] rounded-[4px] animate-pulse">
              <LoaderIcon />
            <span className="text-sm text-[#25283D]">Loading data...</span>
          </div>
        );
      }
      if (error) {
        return (
          <div className="h-full p-6">
            <div className="h-full flex flex-col items-center justify-center gap-4 bg-white rounded-[4px]">
              <Info className="h-10 w-10 text-[var(--error)]" />
              <span className="text-[var(--error)] text-base font-semibold">{error}</span>
            </div>
          </div>
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dates = data?.map((item: any) => item.date) ?? [];
      const option = {
        grid: {
          left: '0',
          right: '0',
          bottom: 48,
          top: '8',
          containLabel: true,
        },
        dataZoom: [
          {
            type: 'slider',
            handleSize: 0,
            backgroundCOlor: 'rgba(0,0,0,0)',
            fillerColor: 'rgba(0,0,0,0)',
            borderRadius: 0,
            borderColor: 'rgba(0,0,0,0)',
            brushSelect: true,
            bottom: 0,
            handleStyle: {
              color: 'rgba(0,0,0,0)',
              opacity: 0
            },
            moveHandleSize: 0,
            showDetail: false,
            height: 40,
            selectedDataBackground: {
              areaStyle: {
                color: '#E0EFFF',
                opacity: 1
              },
              lineStyle: {
                opacity: 1,
                color: '#357AF6',
              }
            }
          },
        ],
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
            confine: true,
          },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              interval: 'auto',
              hideOverlap: true,
              formatter: (value: string) => {
                const date = new Date(value);
                const isLessThan3Day = params.start_date && params.end_date && 
                  (new Date(params.end_date).getTime() - new Date(params.start_date).getTime() <= 86400000 * 3);

                return isLessThan3Day 
                  ? format(date, 'HH:mm')
                  : format(date, 'dd MMM')
              }
            },
            data: dates
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#9D9EA1',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'Inter',
              lineHeight: 16,
              formatter: (value: number) => {
                return formatNumber(value);
              }
            }
          }
        ],
        series: [
          {
            name: 'Total Requests',
            type: 'bar',
            stack: 'Total',
            barMinWidth: 1,
            barMaxWidth: 8,
            barGap: '20%',
            large: true,
            itemStyle: {
              color: '#357AF6'
            },
            emphasis: {
              focus: 'self',
              blurScope: "coordinateSystem",
              itemStyle: {
                color: '#357AF6',
              }
            },
            blur: {
              itemStyle: {
                color: '#E0EFFF',
                opacity: 1
             }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data?.map((item: any) => item.total_requests) ?? []
          },
          {
            name: 'Error Count',
            type: 'bar',
            stack: 'Total',
            smooth: true,
            itemStyle: {
              color: '#fe5c73'
            },
            showSymbol: false,
            emphasis: {
              focus: 'self',
              blurScope: "coordinateSystem",
              itemStyle: {
                color: '#fe5c73'
              }
            },
            blur: {
                itemStyle: {
                  color: '#fdaac1',
                  opacity: 1
               }
              },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data?.map((item: any) => item.error_count) ?? []
          }
        ]
      };
    
      return (
        <ReactECharts 
          option={option} 
          style={{ height: '160px' }} 
          onEvents={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            datazoom: (zoomParams: any) => {
              const start = zoomParams.start / 100;
              const end = zoomParams.end / 100;
              const dates = data?.map(item => item.date) ?? [];
              if (dates.length > 0) {
                const startIndex = Math.floor(dates.length * start);
                const endIndex = Math.floor(dates.length * end);
                params.onDateRangeSelect?.(
                  String(dates[startIndex]).split('.')[0],
                  String(dates[Math.min(endIndex, dates.length - 1)]).split('.')[0]
                );
              }
            }
          }}
        />
      );

  // return <BarChart 
  //   endpoint={`${process.env.NEXT_PUBLIC_TINYBIRD_API_URL}/v0/pipes/log_timeseries.json`}
  //   token={params.token ?? ''}
  //   index="date"
  //   categories={['total_requests', 'error_count']}
  //   height="140px"
  //   params={{
  //     start_date: params.start_date ?? '',
  //     end_date: params.end_date ?? '',
  //     request_path: params.request_path?.join(',') ?? '',
  //     user_agent: params.user_agent?.join(',') ?? '',
  //     status_code: params.status_code?.join(',') ?? '',
  //     service: params.service?.join(',') ?? '',
  //     level: params.level?.join(',') ?? '',
  //     environment: params.environment?.join(',') ?? '',
  //     request_method: params.request_method?.join(',') ?? '',
  //     message: params.message ?? '',
  //   }}
  //   stacked={true}
  //   colorPalette={['#357AF6', '#fe5b73']}
  //   options={{
  //     grid: {
  //       left: 0,
  //       right: 0,
  //       top: 8,
  //       bottom: 0,
  //       containLabel: true,
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       backgroundColor: '#25283D',
  //       borderWidth: 0,
  //       padding: 12,
  //       textStyle: {
  //           color: '#FFFFFF',
  //           fontSize: 12,
  //           fontWeight: 'normal',
  //           fontFamily: 'Inter',
  //           lineHeight: 16,
  //       },
  //     },
  //     xAxis: {
  //       axisLabel: {
  //           color: '#9D9EA1',
  //           fontSize: 12,
  //           fontWeight: 500,
  //           fontFamily: 'Inter',
  //           lineHeight: 16,
  //       }
  //     },
  //     yAxis: {
  //       axisLabel: {
  //           color: '#9D9EA1',
  //           fontSize: 12,
  //           fontWeight: 500,
  //           fontFamily: 'Inter',
  //           lineHeight: 16,
  //       }
  //     }
  //   }}
  // />
}