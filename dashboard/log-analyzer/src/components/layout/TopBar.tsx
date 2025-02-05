'use client';

import { SearchBar } from "@/components/filters/SearchBar";
import { DateRangeSelector } from "@/components/filters/DateRangeSelector";
import { RefreshButton } from "@/components/filters/RefreshButton";

export default function TopBar() {
  return (
    <div className="border-b border-border p-4">
      <div className="flex items-center space-x-4">
        <SearchBar />
        <DateRangeSelector />
        <RefreshButton />
      </div>
    </div>
  );
}