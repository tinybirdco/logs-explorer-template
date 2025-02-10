'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
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
    setIsTransitioning(true);
    setIsCollapsed(false);
  };

  const handleCollapse = () => {
    setIsTransitioning(true);
    setIsCollapsed(true);
  };

  return (
    <aside 
      className={cn(
        "relative transition-all duration-300 ease-in-out p-6",
        isCollapsed ? "w-42" : "w-[317px]"
      )}
      onTransitionEnd={() => setIsTransitioning(false)}
    >
      {isCollapsed ? (
        <div className="w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center">
        <Button
            variant="ghost"
            size="icon"
            className="btn-icon"
            onClick={handleExpand}
        >
            <ArrowRight className="h-4 w-4" />
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
            "overflow-y-auto p-6 space-y-4 h-full",
            isTransitioning && "opacity-0",
            "transition-opacity duration-150",
            !isTransitioning && "opacity-100"
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
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
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
        </div>
      )}
    </aside>
  );
}