'use client';

import { SearchBar } from "@/components/filters/SearchBar";
import { DateRangeSelector } from "@/components/filters/DateRangeSelector";
import { RefreshButton } from "@/components/filters/RefreshButton";
import dashboardConfig from "@/config/dashboard.json";
import type { FilterConfig } from "@/config/types";
export default function TopBar() {
  const searchFilters = dashboardConfig.filters
    .filter(filter => filter.type === 'search')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="border-b border-border p-4">
      <div className="flex items-center space-x-4">
        {searchFilters.map(filter => (
          <SearchBar key={filter.columnName} filter={filter as FilterConfig} />
        ))}
        <DateRangeSelector />
        <RefreshButton />
      </div>
    </div>
  );
}