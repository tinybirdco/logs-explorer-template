'use client';

import { GenericCounter } from "@/components/metrics/GenericCounter";
import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CollapseIcon, ExpandIcon } from "@/components/icons";
import SplashCursor from '@/components/animations/SplashCursor/SplashCursor'
import { Star } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import Auth component with no SSR
const AuthSection = dynamic(() => import('./SidebarAuth'), {
  ssr: false,
  loading: () => null,
});

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showSplashCursor, setShowSplashCursor] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
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

  // Keep the Konami code effect
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeydown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const requiredKey = konamiCode[konamiIndex].toLowerCase();

      if (key === requiredKey) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setShowSplashCursor(true);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Add this effect to fetch GitHub stars
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/tinybirdco/logs-explorer-template');
        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching star count:', error);
      }
    };
    fetchStarCount();
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
      {showSplashCursor && <SplashCursor />}
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
        <div className="h-[calc(100vh-48px)] bg-white rounded-2xl flex flex-col">
          <div className={cn(
            "overflow-y-auto p-6 space-y-4 flex-grow"
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

            {/* GitHub Star Button */}
            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => window.open('https://github.com/tinybirdco/logs-explorer-template', '_blank')}
              >
                <Star className="h-4 w-4" />
                Star on GitHub
                {starCount !== null && (
                  <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-semibold">
                    {starCount}
                  </span>
                )}
              </Button>
            </div>
              
              {/* Environments */}
              <GenericCounter 
                columnName="environment"
                title="Environments"
                onSelectionChange={createFilterHandler('environment')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
              />
              
              {/* Services */}
              <GenericCounter 
                columnName="service"
                title="Services"
                onSelectionChange={createFilterHandler('service')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
              />

              <div className="space-y-4">
              {/* Log Levels */}
              <GenericCounter 
                columnName="level"
                title="Log Levels"
                onSelectionChange={createFilterHandler('level')}
                shouldRefresh={refreshTrigger}
                startOpen={true}
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

            </div>
          </div>
          
          {/* Updated bottom section with auth */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <AuthSection isCollapsed={isCollapsed} />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}