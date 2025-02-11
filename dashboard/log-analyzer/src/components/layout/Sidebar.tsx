'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Add this effect to listen to refresh events
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshTrigger(prev => !prev);
    };
    
    window.addEventListener('refresh-filters', handleRefresh);
    return () => window.removeEventListener('refresh-filters', handleRefresh);
  }, []);

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

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  const handleCollapse = () => {
    setIsCollapsed(true);
  };

  return (
    <aside 
      className={cn(
        "relative transition-all duration-300 ease-in-out p-6",
        isCollapsed ? "w-42" : "w-[317px]"
      )}
    >
      {isCollapsed ? (
        <div className="w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center">
        <Button
            variant="ghost"
            size="icon"
            className="btn-icon"
            onClick={handleExpand}
        >
            <PanelLeftOpen className="h-4 w-4" />
        </Button>
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 invisible group-hover:visible">
            <div className="bg-[#18191B] text-white text-sm px-4 py-2.5 rounded-lg whitespace-nowrap">
            Expand Filter Panel
            </div>
        </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-48px)] bg-white rounded-2xl">
          <div className={cn(
            "overflow-y-auto p-6 space-y-4 h-full"
          )}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] leading-6 font-semibold text-text-primary">
                Filter by:
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="btn-icon"
                onClick={handleCollapse}
                title="Collapse Filters"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Log Levels */}
              <GenericCounter 
                columnName="level"
                title="Log Levels"
                onSelectionChange={createFilterHandler('level')}
                shouldRefresh={refreshTrigger}
              />
              
              {/* Environments */}
              <GenericCounter 
                columnName="environment"
                title="Environments"
                onSelectionChange={createFilterHandler('environment')}
                shouldRefresh={refreshTrigger}
              />
              
              {/* Services */}
              <GenericCounter 
                columnName="service"
                title="Services"
                onSelectionChange={createFilterHandler('service')}
                shouldRefresh={refreshTrigger}
              />
              
              {/* HTTP Methods */}
              <GenericCounter 
                columnName="request_method"
                title="HTTP Methods"
                onSelectionChange={createFilterHandler('request_method')}
                shouldRefresh={refreshTrigger}
              />
              
              {/* Status Codes */}
              <GenericCounter 
                columnName="status_code"
                title="Status Codes"
                onSelectionChange={createFilterHandler('status_code')}
                shouldRefresh={refreshTrigger}
              />

              {/* Request Paths */}
              <GenericCounter 
                columnName="request_path"
                title="Request Paths"
                onSelectionChange={createFilterHandler('request_path')}
                shouldRefresh={refreshTrigger}
              />

              {/* User Agents */}
              <GenericCounter 
                columnName="user_agent"
                title="User Agents"
                onSelectionChange={createFilterHandler('user_agent')}
                shouldRefresh={refreshTrigger}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}