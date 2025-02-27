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
import { LoaderIcon } from "@/components/icons";
import { FileIcon } from "@/components/icons";
import React from 'react';
import { LogDetailPanel } from "./LogDetailPanel";

interface LogTableProps {
  logs: LogEntry[];
  onSort: (column: string) => void;
  sortColumn?: string;
  sortOrder?: 'asc' | 'desc';
  observerRef?: (node: Element | null) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function LogTable({ logs = [], onSort, sortColumn, sortOrder, observerRef, isLoading, hasMore, isLoadingMore }: LogTableProps) {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const renderSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return hoveredColumn === column ? ' ↑' : null;
  };

  return (
    <div className="flex flex-col h-full relative">
      {isLoading ? (
        <div className="h-full">
          <div className="space-y-[29px]">
          {[...Array(Math.ceil((window.innerHeight - 48) / 67))].map((_, index) => (
              <div 
                key={index}
                className="h-[24px] bg-[#D9D9D9] rounded-[4px] animate-pulse" 
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-white">
            <Table className="border-collapse w-full table-fixed p-0">
              <TableHeader className="table-header p-0 m-0">
                <TableRow className="p-0 m-0">
                  <TableHead 
                    className="w-[15%] whitespace-nowrap px-4 py-3 text-left"
                    onClick={() => onSort('timestamp')}
                    onMouseEnter={() => setHoveredColumn('timestamp')}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    Time{renderSortIndicator('timestamp')}
                  </TableHead>
                  <TableHead className="w-[15%] whitespace-nowrap px-4 py-3 text-left">User Name</TableHead>
                  <TableHead className="w-[15%] px-4 py-3 text-left">Connection</TableHead>
                  <TableHead className="w-[44%] px-4 py-3 text-left">Description</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {logs.length === 0 ? (
            <div className="h-[calc(100%-24px)] flex flex-col items-center justify-center bg-[--background] rounded-lg mt-6">
              <div className="mb-[18px]">
                <FileIcon />
              </div>
              <span className="text-[#000000] text-[16px]">No data for the selected filter</span>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <div className="h-full">
                <Table className="border-collapse w-full table-fixed p-0">
                  <TableBody>
                    {logs?.map((log, index) => (
                      <TableRow 
                        key={index}
                        className="table-row cursor-pointer hover:bg-muted/50 p-0 m-0" 
                        onClick={() => handleRowClick(log)}
                      >
                        <TableCell className="w-[15%] whitespace-nowrap px-4 py-3 text-left truncate">
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
                        <TableCell className="w-[15%] whitespace-nowrap px-4 py-3 text-left">{log.user_name}</TableCell>
                        <TableCell className="w-[15%] px-4 py-3 text-left">{log.connection}</TableCell>
                        <TableCell className="w-[44%] px-4 py-3 text-left">{log.description}</TableCell>
                      </TableRow>
                    ))}
                    {hasMore && (
                      <TableRow ref={observerRef}>
                        <TableCell colSpan={7} className="p-0 h-4" />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </>
      )}
      <LogDetailPanel 
        log={selectedLog}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLog(null);
        }}
      />
      {isLoadingMore && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-[#357AF6] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <LoaderIcon color="#FFFFFF" />
            <span className="text-sm text-white">Loading more...</span>
          </div>
        </div>
      )}
    </div>
  );
} 