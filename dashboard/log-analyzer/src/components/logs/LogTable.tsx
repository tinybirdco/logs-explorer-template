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
import { type LogEntry } from "@/lib/types";
import { useState } from 'react';

interface LogTableProps {
  logs: LogEntry[];
  onSort: (column: string) => void;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  className?: string;
}

export function LogTable({ logs = [], onSort, sortColumn, sortOrder, className }: LogTableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const renderSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return hoveredColumn === column ? ' ↑' : null;
  };

  return (
    <div className={`rounded-lg ${className}`}>
      <div className="relative h-[calc(100vh-140px)]">
        <div className="sticky top-0 w-full z-10">
          <Table className="w-full table-fixed">
            <TableHeader className="table-header bg-white">
              <TableRow>
                <TableHead 
                  className="w-[10%] truncate" 
                  onClick={() => onSort('request_id')}
                  onMouseEnter={() => setHoveredColumn('request_id')}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  ID{renderSortIndicator('request_id')}
                </TableHead>
                <TableHead 
                  className="w-[10%] truncate" 
                  onClick={() => onSort('timestamp')}
                  onMouseEnter={() => setHoveredColumn('timestamp')}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Time{renderSortIndicator('timestamp')}
                </TableHead>
                <TableHead 
                  className="w-[8%] truncate" 
                  onClick={() => onSort('level')} 
                  onMouseEnter={() => setHoveredColumn('level')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Level{renderSortIndicator('level')}
                </TableHead>
                <TableHead 
                  className="w-[10%] truncate" 
                  onClick={() => onSort('service')} 
                  onMouseEnter={() => setHoveredColumn('service')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Service{renderSortIndicator('service')}
                </TableHead>
                <TableHead 
                  className="w-[10%] truncate" 
                  onClick={() => onSort('request_method')} 
                  onMouseEnter={() => setHoveredColumn('request_method')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Method{renderSortIndicator('request_method')}
                </TableHead>
                <TableHead 
                  className="w-[14%] truncate" 
                  onClick={() => onSort('request_path')} 
                  onMouseEnter={() => setHoveredColumn('request_path')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Path{renderSortIndicator('request_path')}
                </TableHead>
                <TableHead 
                  className="w-[8%] truncate" 
                  onClick={() => onSort('status_code')} 
                  onMouseEnter={() => setHoveredColumn('status_code')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Status{renderSortIndicator('status_code')}
                </TableHead>
                <TableHead 
                  className="w-[30%] truncate" 
                  onClick={() => onSort('message')} 
                  onMouseEnter={() => setHoveredColumn('message')} 
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  Message{renderSortIndicator('message')}
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        <div className="overflow-y-auto h-full">
          <Table className="table-fixed w-full">
            <TableBody>
              {logs?.map((log, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell className="w-[10%] truncate">{log.request_id}</TableCell>
                  <TableCell className="w-[10%] truncate">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</TableCell>
                  <TableCell className="w-[8%] truncate">
                    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium
                      ${log.level === 'ERROR' ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                        log.level === 'WARN' ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                        log.level === 'INFO' ? 'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]' : 
                        log.level === 'DEBUG' ? 'bg-[var(--bg-pill-debug)] text-[var(--text-pill-debug)]' : 
                        'bg-[var(--bg-pill-default)] text-[var(--text-pill-default)]'}`
                    }>
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell className="w-[10%] truncate">{log.service}</TableCell>
                  <TableCell className="w-[10%] truncate">{log.request_method}</TableCell>
                  <TableCell className="w-[14%] truncate">{log.request_path}</TableCell>
                  <TableCell className="w-[8%] truncate">
                    <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium
                      ${log.status_code >= 400 ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                        log.status_code >= 300 ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                        log.status_code >= 200 ? 'bg-[var(--bg-pill-success)] text-[var(--text-pill-success)]' : 
                        'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]'}`
                    }>
                      {log.status_code}
                    </span>
                  </TableCell>
                  <TableCell className="w-[30%] truncate">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 