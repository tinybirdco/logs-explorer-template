'use client';

import { LogEntry } from "@/lib/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogDetailPanelProps {
  log: LogEntry | null;
  onClose: () => void;
  isOpen: boolean;
}

export function LogDetailPanel({ log, onClose, isOpen }: LogDetailPanelProps) {
  if (!log) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 h-screen w-[600px] bg-[--background-secondary] transform transition-transform duration-300 ease-in-out z-50",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="pr-8 pt-[30px] h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="btn-icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Request Info */}
        <div className="px-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-[26px]">
            <span>{log.request_method}</span>
            <span>{log.request_path}</span>
            <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium
              ${log.status_code >= 400 ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                log.status_code >= 300 ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                log.status_code >= 200 ? 'bg-[var(--bg-pill-success)] text-[var(--text-pill-success)]' : 
                'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]'}`
            }>
              {log.status_code}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Request started</span>
            <span>{formatDate(log.timestamp)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 flex-1 overflow-auto mx-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Request ID</h3>
              <p className="text-sm">{log.request_id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Timestamp</h3>
              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Level</h3>
              <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium
                ${log.level === 'ERROR' ? 'bg-[var(--bg-pill-error)] text-[var(--text-pill-error)]' : 
                  log.level === 'WARN' ? 'bg-[var(--bg-pill-warn)] text-[var(--text-pill-warn)]' : 
                  log.level === 'INFO' ? 'bg-[var(--bg-pill-info)] text-[var(--text-pill-info)]' : 
                  log.level === 'DEBUG' ? 'bg-[var(--bg-pill-debug)] text-[var(--text-pill-debug)]' : 
                  'bg-[var(--bg-pill-default)] text-[var(--text-pill-default)]'}`
              }>
                {log.level}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Service</h3>
              <p className="text-sm">{log.service}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Request Method</h3>
              <p className="text-sm">{log.request_method}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Request Path</h3>
              <p className="text-sm break-all">{log.request_path}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">User Agent</h3>
              <p className="text-sm break-all">{log.user_agent}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Message</h3>
              <p className="text-sm break-all whitespace-pre-wrap">{log.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 