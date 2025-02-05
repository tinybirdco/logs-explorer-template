'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DateRangeSelector } from "@/components/filters/DateRangeSelector";

export default function TopBar() {
  return (
    <div className="border-b border-border p-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-8"
          />
        </div>
        <DateRangeSelector />
      </div>
    </div>
  );
}