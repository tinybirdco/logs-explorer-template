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
    <main className="flex h-screen bg-background">
      <Suspense fallback={
        <div className="w-80 border-r border-border bg-card p-6 space-y-4">
          <div className="animate-pulse bg-muted h-8 w-full rounded" />
          <div className="animate-pulse bg-muted h-32 w-full rounded" />
          <div className="animate-pulse bg-muted h-32 w-full rounded" />
        </div>
      }>
        <Sidebar />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <Suspense fallback={
          <div className="border-b border-border bg-card p-6">
            <div className="animate-pulse bg-muted h-10 w-full rounded" />
          </div>
        }>
          <TopBar />
        </Suspense>
        <div className="flex-1 pr-6 py-6 space-y-6 overflow-hidden flex flex-col">
          <div className="bg-card rounded-lg">
            <TimeSeriesChartWrapper {...params} />
          </div>
          <div className="bg-card rounded-lg flex-1 overflow-hidden">
            <LogTableWithPagination pageSize={20} />
          </div>
        </div>
      </div>
    </main>
  );
}