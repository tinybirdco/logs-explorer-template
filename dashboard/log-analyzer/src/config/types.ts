export interface FilterConfig {
  columnName: string;
  title: string;
  type: 'search' | 'select' | 'multiselect';
  width?: string;
  order?: number;
}

export interface TableColumnConfig {
  key: string;
  title: string;
  width: string;
  type: 'text' | 'datetime' | 'badge';
  truncate?: boolean;
  badgeConfig?: {
    colorMap: Record<string | number, string>;
    defaultColor: string;
  };
}

export interface TimeseriesConfig {
  endpoint: string;
  index: string;
  categories: string[];
  height: string;
  colorPalette: string[];
  params: {
    name: string;
    type: 'string' | 'string[]';
  }[];
}

export interface DashboardConfig {
  filters: FilterConfig[];
  table: {
    columns: TableColumnConfig[];
  };
  timeseries: TimeseriesConfig;
  endpoints: {
    counter: string;
    timeseries: string;
    logs: string;
  };
}

// Type helper for inferring LogEntry from column config
export type InferLogEntry<T extends TableColumnConfig[]> = {
  [K in T[number]['key']]: string | number;
};
