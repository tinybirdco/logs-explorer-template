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
    <div className="rounded-md border h-[calc(100vh-64px)] flex flex-col">
      <div className="overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead onClick={() => onSort('request_id')} className="cursor-pointer">
                ID{renderSortIndicator('request_id')}
              </TableHead>
              <TableHead onClick={() => onSort('timestamp')} className="cursor-pointer">
                Time{renderSortIndicator('timestamp')}
              </TableHead>
              <TableHead onClick={() => onSort('level')} className="cursor-pointer">
                Level{renderSortIndicator('level')}
              </TableHead>
              <TableHead onClick={() => onSort('service')} className="cursor-pointer">
                Service{renderSortIndicator('service')}
              </TableHead>
              <TableHead onClick={() => onSort('request_method')} className="cursor-pointer">
                Method{renderSortIndicator('request_method')}
              </TableHead>
              <TableHead onClick={() => onSort('request_path')} className="cursor-pointer">
                Path{renderSortIndicator('request_path')}
              </TableHead>
              <TableHead onClick={() => onSort('status_code')} className="cursor-pointer">
                Status{renderSortIndicator('status_code')}
              </TableHead>
              <TableHead onClick={() => onSort('message')} className="cursor-pointer">
                Message{renderSortIndicator('message')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">
                  {log.request_id}
                </TableCell>
                <TableCell className="font-mono">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${log.level === 'ERROR' ? 'bg-red-100 text-red-700' : 
                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`
                  }>
                    {log.level}
                  </span>
                </TableCell>
                <TableCell>{log.service}</TableCell>
                <TableCell>{log.request_method}</TableCell>
                <TableCell className="font-mono">{log.request_path}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                    ${log.status_code >= 500 ? 'bg-red-100 text-red-700' : 
                      log.status_code >= 400 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`
                  }>
                    {log.status_code}
                  </span>
                </TableCell>
                <TableCell className="max-w-md truncate">{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 