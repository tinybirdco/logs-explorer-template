'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLogs } from "@/contexts/LogContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { fetchLogs } = useLogs();
  
  // Update URL with new filters and fetch logs
  const updateFilters = useCallback((filters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update each filter in the URL
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });
    
    // Use replace instead of push to avoid adding to history
    router.replace(`${pathname}?${params.toString()}`);

    // Only include non-empty filters
    const nonEmptyFilters: Record<string, string[]> = {};
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        nonEmptyFilters[key] = values;
      }
    });

    // Convert status_code to numbers if present
    if (nonEmptyFilters.status_code) {
      fetchLogs({
        ...nonEmptyFilters,
        status_code: nonEmptyFilters.status_code.map(Number),
      });
    } else {
      fetchLogs(nonEmptyFilters);
    }
  }, [pathname, router, searchParams, fetchLogs]);

  // Create handler factory for each filter type
  const createFilterHandler = (paramName: string) => {
    return (selected: string[]) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      const filters: Record<string, string[]> = {
        service: currentParams.get('service')?.split(',').filter(Boolean) || [],
        level: currentParams.get('level')?.split(',').filter(Boolean) || [],
        environment: currentParams.get('environment')?.split(',').filter(Boolean) || [],
        request_method: currentParams.get('request_method')?.split(',').filter(Boolean) || [],
        status_code: currentParams.get('status_code')?.split(',').filter(Boolean) || [],
        request_path: currentParams.get('request_path')?.split(',').filter(Boolean) || [],
        user_agent: currentParams.get('user_agent')?.split(',').filter(Boolean) || [],
      };

      // Update the specific filter
      filters[paramName] = selected;

      updateFilters(filters);
    };
  };

  return (
    <div className="w-80 flex-none overflow-y-auto border-r pt-4 pl-4 pr-4 space-y-4 h-[calc(100vh-50px)]">
      {/* Timeline component */}
      
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
  );
}