'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { type DashboardConfig, type InferLogEntry, type TableColumnConfig } from "@/config/types";
import dashboardConfig from "@/config/dashboard.json" assert { type: "json" };

const config = dashboardConfig as DashboardConfig;

type LogEntry = InferLogEntry<typeof config.table.columns>;

interface LogTableProps {
  logs: LogEntry[];
  onSort: (column: string) => void;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
}

function renderCell(column: TableColumnConfig, value: string | number) {
  const content = (() => {
    switch (column.type) {
      case 'datetime':
        return formatDistanceToNow(new Date(value as string), { addSuffix: true });
      case 'badge':
        const color = column.badgeConfig?.colorMap[value] || column.badgeConfig?.defaultColor;
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}>
            {value}
          </span>
        );
      default:
        return value;
    }
  })();

  return column.truncate ? (
    <div className="truncate" title={String(value)}>
      {content}
    </div>
  ) : content;
}

export function LogTable({ logs = [], onSort, sortColumn, sortOrder }: LogTableProps) {
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="rounded-md border">
      <div className="relative h-[calc(100vh-140px)]">
        <div className="sticky top-0 w-full bg-white z-10">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                {config.table.columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={column.width}
                    onClick={() => onSort(column.key)}
                  >
                    {column.title}{renderSortIndicator(column.key)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        <div className="overflow-y-auto h-full">
          <Table className="table-fixed w-full">
            <TableBody>
              {logs?.map((log, index) => (
                <TableRow key={index}>
                  {config.table.columns.map((column) => (
                    <TableCell key={column.key} className={column.width}>
                      {renderCell(column, log[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 