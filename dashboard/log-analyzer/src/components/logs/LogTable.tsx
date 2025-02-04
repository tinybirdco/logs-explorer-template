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
}

export function LogTable({ logs = [] }: LogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Message</TableHead>
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
  );
} 