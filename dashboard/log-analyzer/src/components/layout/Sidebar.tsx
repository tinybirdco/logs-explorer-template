'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Update URL with new filters
  const createFilterHandler = useCallback((filterName: string) => {
    return (selected: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (selected.length > 0) {
        params.set(filterName, selected.join(','));
      } else {
        params.delete(filterName);
      }
      
      router.replace(`${pathname}?${params.toString()}`);
    };
  }, [pathname, router, searchParams]);

  return (
    <div className={cn(
      "relative transition-all duration-300 ease-in-out",
      isCollapsed ? "w-0" : "w-80"
    )}>
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out h-[calc(100vh-50px)]",
          isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-80 opacity-100"
        )}
      >
        <div className="overflow-y-auto pt-4 pl-4 pr-4 space-y-4 h-full">
          {/* Log Levels */}
          <GenericCounter 
            columnName="level"
            title="Log Levels"
            onSelectionChange={createFilterHandler('level')}
          />
          
          {/* Environments */}
          <GenericCounter 
            columnName="environment"
            title="Environments"
            onSelectionChange={createFilterHandler('environment')}
          />
          
          {/* Services */}
          <GenericCounter 
            columnName="service"
            title="Services"
            onSelectionChange={createFilterHandler('service')}
          />
          
          {/* HTTP Methods */}
          <GenericCounter 
            columnName="request_method"
            title="HTTP Methods"
            onSelectionChange={createFilterHandler('request_method')}
          />
          
          {/* Status Codes */}
          <GenericCounter 
            columnName="status_code"
            title="Status Codes"
            onSelectionChange={createFilterHandler('status_code')}
          />

          {/* Request Paths */}
          <GenericCounter 
            columnName="request_path"
            title="Request Paths"
            onSelectionChange={createFilterHandler('request_path')}
          />

          {/* User Agents */}
          <GenericCounter 
            columnName="user_agent"
            title="User Agents"
            onSelectionChange={createFilterHandler('user_agent')}
          />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 rounded-full border shadow-md bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}