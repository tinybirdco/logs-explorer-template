import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { LogTableWithPagination } from "@/components/logs/LogTableWithPagination";
import { TimeSeriesChartWrapper } from "@/components/charts/TimeSeriesChartWrapper";

function formatDate(date: Date) {
  return date.toISOString().split('.')[0].replace('T', ' ').replace('Z', '');
}

export default async function Page() {
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 24 * 30 * 60 * 60 * 1000);

  const params = {
    token: process.env.NEXT_PUBLIC_TINYBIRD_API_KEY,
    start_date: formatDate(hourAgo),
    end_date: formatDate(now)
  };

  return (
    <main className="flex h-screen bg-background">
      <div className="w-80 border-r border-border">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar />
        </Suspense>
      </div>

      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
          <div className="h-48 border rounded-md bg-white">
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