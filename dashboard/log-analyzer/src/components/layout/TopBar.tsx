'use client';

import { SearchBar } from "@/components/filters/SearchBar";
import { DateRangeSelector } from "@/components/filters/DateRangeSelector";
import { RefreshButton } from "@/components/filters/RefreshButton";

export default function TopBar() {
  return (
    <div className="pt-6 pr-6">
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center space-x-2">
          <SearchBar />
          <DateRangeSelector />
          <RefreshButton />
        </div>
      </div>
    </div>
  );
}