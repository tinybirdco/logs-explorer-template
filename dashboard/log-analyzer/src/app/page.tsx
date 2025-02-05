import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { LogTableWithPagination } from "@/components/logs/LogTableWithPagination";
import { TimeSeriesChartWrapper } from "@/components/charts/TimeSeriesChartWrapper";

export default async function Page() {
  const params = {
    token: process.env.NEXT_PUBLIC_TINYBIRD_API_KEY,
  };

  return (
    <main className="flex h-screen bg-background overflow-hidden">
      <Suspense fallback={
        <div className="w-80 border-r border-border p-4 space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-32 w-full rounded" />
          <div className="animate-pulse bg-gray-200 h-32 w-full rounded" />
        </div>
      }>
        <Sidebar />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={
          <div className="border-b border-border p-4">
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded" />
          </div>
        }>
          <TopBar />
        </Suspense>
        <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
          <div className="border rounded-md bg-white pb-4">
            <Suspense fallback={<div>Loading chart...</div>}>
              <TimeSeriesChartWrapper {...params} />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading logs...</div>}>
            <LogTableWithPagination pageSize={20} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}