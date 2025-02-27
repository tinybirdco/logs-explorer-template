'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CollapseIcon, ExpandIcon } from "@/components/icons";

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
    <aside className={cn("relative transition-all duration-300 ease-in-out p-6 [&_*]:cursor-pointer",
      isCollapsed ? "w-42" : "w-[317px]"
    )}>
      {isCollapsed ? (
        <div className="w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="btn-icon"
              onClick={handleExpand}
            >
              <ExpandIcon />
            </Button>
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
              >
                <CollapseIcon />
              </Button>
            </div>
              
              {/* Tenant Name */}
              <GenericCounter 
                columnName="tenant_name"
                title="Tenant Name"
                onSelectionChange={createFilterHandler('tenant_name')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
              />
              
              {/* Client Name */}
              <GenericCounter 
                columnName="client_name"
                title="Client Name"
                onSelectionChange={createFilterHandler('client_name')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
              />

              <div className="space-y-4">
              {/* User Name */}
              <GenericCounter 
                columnName="user_name"
                title="User Name"
                onSelectionChange={createFilterHandler('user_name')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
              />
              
              {/* User Agent */}
              <GenericCounter 
                columnName="user_agent"
                title="User Agent"
                onSelectionChange={createFilterHandler('user_agent')}
                shouldRefresh={refreshTrigger}
              />
              
              {/* Hostname */}
              <GenericCounter 
                columnName="hostname"
                title="Hostname"
                onSelectionChange={createFilterHandler('status_code')}
                shouldRefresh={refreshTrigger}
              />

              {/* Description */}
              <GenericCounter 
                columnName="description"
                title="Description"
                onSelectionChange={createFilterHandler('description')}
                shouldRefresh={refreshTrigger}
              />

              {/* Connection */}
              <GenericCounter 
                columnName="connection"
                title="Connection"
                onSelectionChange={createFilterHandler('connection')}
                shouldRefresh={refreshTrigger}
              />

              {/* Strategy */}
              <GenericCounter 
                columnName="strategy"
                title="Strategy"
                onSelectionChange={createFilterHandler('strategy')}
                shouldRefresh={refreshTrigger}
              />

              {/* Strategy Type */}
              <GenericCounter 
                columnName="strategy_type"
                title="Strategy Type"
                onSelectionChange={createFilterHandler('strategy_type')}
                shouldRefresh={refreshTrigger}
              />

            </div>
          </div>
        </div>
      )}
    </aside>
  );
}