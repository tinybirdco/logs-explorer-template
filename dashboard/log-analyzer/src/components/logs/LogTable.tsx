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

interface LogTableProps {
  logs: LogEntry[];
  onSort: (column: string) => void;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
}

export function LogTable({ logs = [], onSort, sortColumn, sortOrder }: LogTableProps) {
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="rounded-lg">
      <div className="relative h-[calc(100vh-140px)]">
        <div className="sticky top-0 w-full z-10">
          <Table className="table-fixed w-full">
            <TableHeader className="table-header bg-white">
              <TableRow>
                <TableHead className="w-32" onClick={() => onSort('request_id')}>
                  ID{renderSortIndicator('request_id')}
                </TableHead>
                <TableHead className="w-32" onClick={() => onSort('timestamp')}>
                  Time{renderSortIndicator('timestamp')}
                </TableHead>
                <TableHead className="w-16" onClick={() => onSort('level')}>
                  Level{renderSortIndicator('level')}
                </TableHead>
                <TableHead className="w-24" onClick={() => onSort('service')}>
                  Service{renderSortIndicator('service')}
                </TableHead>
                <TableHead className="w-16" onClick={() => onSort('request_method')}>
                  Method{renderSortIndicator('request_method')}
                </TableHead>
                <TableHead className="w-64" onClick={() => onSort('request_path')}>
                  Path{renderSortIndicator('request_path')}
                </TableHead>
                <TableHead className="w-16" onClick={() => onSort('status_code')}>
                  Status{renderSortIndicator('status_code')}
                </TableHead>
                <TableHead className="flex-1" onClick={() => onSort('message')}>
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
                <TableRow key={index}>
                  <TableCell className="w-32 font-mono truncate">{log.request_id}</TableCell>
                  <TableCell className="w-32 font-mono">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="w-16">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${log.level === 'ERROR' ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                        log.level === 'WARN' ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                        log.level === 'INFO' ? 'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]' : 
                        log.level === 'DEBUG' ? 'bg-[var(--bg-pill-debug)] text-[var(--text-pill-debug)]' : 
                        'bg-[var(--bg-pill-default)] text-[var(--text-pill-default)]'}`
                    }>
                      {log.level}
                    </span>
                  </TableCell>
                  <TableCell className="w-24">{log.service}</TableCell>
                  <TableCell className="w-16">{log.request_method}</TableCell>
                  <TableCell className="w-64 font-mono">{log.request_path}</TableCell>
                  <TableCell className="w-16">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${log.status_code >= 400 ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                        log.status_code >= 300 ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                        log.status_code >= 200 ? 'bg-[var(--bg-pill-success)] text-[var(--text-pill-success)]' : 
                        'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]'}`
                    }>
                      {log.status_code}
                    </span>
                  </TableCell>
                  <TableCell className="flex-1 max-w-md truncate">{log.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
} 