import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { LogTableWithPagination } from "@/components/logs/LogTableWithPagination";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";

export default async function Page() {
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
              <TimeSeriesChart />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading logs...</div>}>
            <LogTableWithPagination 
              pageSize={20}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}