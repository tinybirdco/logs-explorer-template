import { type DashboardConfig } from "@/config/types";
import dashboardConfig from "@/config/dashboard.json";

const config = dashboardConfig as DashboardConfig;

type FilterValue = string | string[] | number[] | undefined;

export function getFiltersFromParams(
  searchParams: URLSearchParams,
  additionalParams: Record<string, FilterValue> = {}
): Record<string, FilterValue> {
  const filters = config.filters.reduce((acc, filter) => {
    const value = searchParams.get(filter.columnName);
    if (!value) return acc;

    if (filter.type === 'search') {
      acc[filter.columnName] = value;
    } else {
      const values = value.split(',').filter(Boolean);
      if (values.length === 0) return acc;

      // Handle special case for status_code which needs number conversion
      acc[filter.columnName] = filter.columnName === 'status_code' 
        ? values.map(Number)
        : values;
    }
    return acc;
  }, {} as Record<string, FilterValue>);

  // Add date range params
  filters.start_date = searchParams.get('start_date') || undefined;
  filters.end_date = searchParams.get('end_date') || undefined;

  // Add any additional params (like sort_by, order)
  return {
    ...filters,
    ...additionalParams
  };
} 