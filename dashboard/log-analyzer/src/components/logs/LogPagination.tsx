'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LogPaginationProps {
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function LogPagination({
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: LogPaginationProps) {
  const totalPages = Math.ceil(totalRows / pageSize);
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Rows per page
        </p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </PaginationButton>
          </PaginationItem>
          
          <PaginationItem>
            <span className="flex h-9 items-center px-4 text-sm">
              Page {page + 1} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </PaginationButton>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 