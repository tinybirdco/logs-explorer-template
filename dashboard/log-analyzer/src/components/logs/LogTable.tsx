'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type LogEntry } from "@/lib/types";
import { useState } from 'react';
import { Loader2 } from "lucide-react";
import { FileIcon } from "@/components/icons";
import React from 'react';

interface LogTableProps {
  logs: LogEntry[];
  onSort: (column: string) => void;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  observerRef?: (node: Element | null) => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function LogTable({ logs = [], onSort, sortColumn, sortOrder, observerRef, isLoading, hasMore }: LogTableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const renderSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return hoveredColumn === column ? ' ↑' : null;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-white">
        <Table className="border-collapse w-full table-fixed">
          <TableHeader className="table-header">
            <TableRow>
              <TableHead 
                className="w-[10%] truncate" 
              >
                ID
              </TableHead>
              <TableHead 
                className="w-[120px] max-w-[120px] truncate"
                onClick={() => onSort('timestamp')}
                onMouseEnter={() => setHoveredColumn('timestamp')}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                Time{renderSortIndicator('timestamp')}
              </TableHead>
              <TableHead 
                className="w-[80px] max-w-[80px] truncate"
              >
                Level
              </TableHead>
              <TableHead 
                className="w-[120px] max-w-[120px] truncate" 
              >
                Service
              </TableHead>
              <TableHead 
                className="w-[80px] max-w-[80px] truncate"
              >
                Method
              </TableHead>
              <TableHead 
                className="w-[14%] truncate" 
              >
                Path
              </TableHead>
              <TableHead 
                className="w-[80px] max-w-[80px] truncate"
              >
                Status
              </TableHead>
              <TableHead 
                className="w-[30%] truncate" 
              >
                Message
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      
      {logs.length === 0 ? (
        <div className="h-[calc(100%-24px)] flex flex-col items-center justify-center bg-[--background] rounded-lg mt-6">
          <div className="mb-[18px]">
            <FileIcon />
          </div>
          <span className="text-[#000000]">No data for the selected filter</span>
        </div>
      ) : (
      <div className="flex-1 overflow-auto min-h-0">
        <div className="h-full">
            <Table className="border-collapse w-full table-fixed">
              <TableBody>
                {logs?.map((log, index) => (
                  <React.Fragment key={log.request_id || index}>
                    {hasMore && index === logs.length - 6 && (
                      <tr ref={observerRef}>
                        <td colSpan={8} className="p-0">
                          {isLoading && (
                            <div className="w-full flex items-center justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                    <TableRow className="table-row">
                      <TableCell className="w-[10%] truncate">{log.request_id}</TableCell>
                      <TableCell className="w-[120px] max-w-[120px] truncate">
                        {new Date(log.timestamp).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        }).replace(',', '')}
                      </TableCell>
                      <TableCell className="w-[80px] max-w-[80px] truncate">
                        <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium
                          ${log.level === 'ERROR' ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                            log.level === 'WARN' ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                            log.level === 'INFO' ? 'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]' : 
                            log.level === 'DEBUG' ? 'bg-[var(--bg-pill-debug)] text-[var(--text-pill-debug)]' : 
                            'bg-[var(--bg-pill-default)] text-[var(--text-pill-default)]'}`
                        }>
                          {log.level}
                        </span>
                      </TableCell>
                      <TableCell className="w-[120px] max-w-[120px] truncate">{log.service}</TableCell>
                      <TableCell className="w-[80px] max-w-[80px] truncate">{log.request_method}</TableCell>
                      <TableCell className="w-[14%] truncate">{log.request_path}</TableCell>
                      <TableCell className="w-[80px] max-w-[80px] truncate">
                        <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium
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
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
} 