'use client';

import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, Search, X, Info } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";
import { cn } from "@/lib/utils";
import { subDays, format } from "date-fns";
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from "@/components/ui/tooltip";
import { useTinybirdApi } from "@/lib/hooks/useTinybirdApi";

interface GenericCounterProps {
  columnName: string;
  title: string;
  onSelectionChange?: (selected: string[]) => void;
  shouldRefresh: boolean;
  startOpen?: boolean;
}

interface CountData {
  category: string;
  count: number;
}

const VISIBLE_ITEMS = 5;

const dataCache: Record<string, CountData[]> = {};

const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function GenericCounter({ 
  columnName, 
  title,
  onSelectionChange,
  shouldRefresh,
  startOpen = false
}: GenericCounterProps) {
  const searchParams = useSearchParams();
  const { genericCounterApi } = useTinybirdApi();
  const [data, setData] = useState<CountData[]>(dataCache[columnName] || []);
  const [filteredData, setFilteredData] = useState<CountData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(startOpen);
  const initializedRef = useRef(false);
  const currentParams = searchParams.get(columnName);
  const service = searchParams.get('service')?.split(',').filter(Boolean) || undefined;
  const level = searchParams.get('level')?.split(',').filter(Boolean) || undefined;
  const environment = searchParams.get('environment')?.split(',').filter(Boolean) || undefined;
  const requestMethod = searchParams.get('request_method')?.split(',').filter(Boolean) || undefined;
  const statusCode = searchParams.get('status_code')?.split(',').filter(Boolean)?.map(Number) || undefined;
  const requestPath = searchParams.get('request_path')?.split(',').filter(Boolean) || undefined;
  const userAgent = searchParams.get('user_agent')?.split(',').filter(Boolean) || undefined;

  useDefaultDateRange();

  // Initialize selected from URL params
  useEffect(() => {
    if (currentParams && !initializedRef.current) {
      const urlParams = currentParams.split(',').filter(Boolean);
      setSelected(urlParams);
      initializedRef.current = true;
    }
  }, [currentParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const start_date = searchParams.get('start_date');
        const end_date = searchParams.get('end_date');
        
        // Default to last 3 days if no dates present
        const defaultEndDate = new Date();
        const defaultStartDate = subDays(defaultEndDate, 3);
        
        const params = {
          column_name: columnName,
          start_date: start_date || format(defaultStartDate, 'yyyy-MM-dd HH:mm:ss'),
          end_date: end_date || format(defaultEndDate, 'yyyy-MM-dd HH:mm:ss'),
          service: columnName !== 'service' ? service : undefined,
          level: columnName !== 'level' ? level : undefined,
          environment: columnName !== 'environment' ? environment : undefined,
          request_method: columnName !== 'request_method' ? requestMethod : undefined,
          status_code: columnName !== 'status_code' ? statusCode : undefined,
          request_path: columnName !== 'request_path' ? requestPath : undefined,
          user_agent: columnName !== 'user_agent' ? userAgent : undefined,
        };

        const response = await genericCounterApi(params);
        setData(response.data || []);
        setFilteredData(response.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setData([]);
      }
    };

    if (isOpen || shouldRefresh) {
      fetchData();
    }
  }, [isOpen, shouldRefresh, searchParams, columnName, service, level, environment, requestMethod, statusCode, requestPath, userAgent, genericCounterApi]);

  // Filter data effect
  useEffect(() => {
    const filtered = data.filter(item => 
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleCheckboxChange = (category: string, checked: boolean) => {
    const newSelected = checked
      ? [...selected, category]
      : selected.filter(item => item !== category);
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  // Get visible items - all if searching, or first VISIBLE_ITEMS if not
  const visibleItems = searchTerm ? filteredData : filteredData.slice(0, VISIBLE_ITEMS);
  const showSearch = data.length > VISIBLE_ITEMS;

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearSelections = () => {
    setSelected([]);
    onSelectionChange?.([]);
  };

  if (error) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 group relative cursor-pointer w-full">
          <div className="absolute -left-3 top-0 bottom-0 w-1 height-24 bg-[var(--error)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-[var(--error)] font-semibold">
            {title}
          </h3>
          <div className="flex-1" />
          <TooltipProvider delayDuration={0}>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Info className="h-6 w-6 text-[var(--error)]" />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2 bg-[var(--error)] text-white">
                <p>{error}</p>
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center justify-between w-full gap-2 group relative cursor-pointer">
          <div className="absolute -left-3 top-0 bottom-0 w-1 height-24 bg-[var(--background-secondary)] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-text-primary transition-all",
              isOpen ? "font-semibold" : "font-normal group-hover:font-semibold"
            )}>
              {title}
            </h3>
            {selected.length > 0 && (
              <div 
                className="flex items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelections();
                }}
              >
                <div className="bg-[var(--background-hover)] text-text-primary px-2 py-0.5 rounded-l font-medium h-6 w-7 flex items-center justify-center">
                  <span className="text-[12px] leading-[16px]">{selected.length}</span>
                </div>
                <div 
                  className="bg-[var(--background-hover)] text-text-primary px-1.5 py-0.5 rounded-r border-l border-white h-6 flex items-center justify-center"
                >
                  <X size={16} />
                </div>
              </div>
            )}
          </div>
          <ChevronUp className={cn(
            "h-6 w-6 transition-transform duration-200 cursor-pointer",
            !isOpen && "transform rotate-180"
          )} />
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        {showSearch && (
          <div className="relative my-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--button-text)]" />
            <Input
              placeholder="Search"
              className="pl-8 border-[var(--border-gray)] border rounded-lg focus-visible:border-1 font-semibold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full hover:bg-muted"
                onClick={handleClearSearch}
                >
                <X className="h-4 w-4" />
                </Button>
            )}
          </div>
          
        )}

        <div className="space-y-2">
          {visibleItems.map(({ category, count }) => (
            <label
              key={category}
              className="flex items-center justify-between py-0 hover:bg-transparent rounded cursor-pointer"
            >
              <div className="flex items-end gap-2">
                <Checkbox
                  className="border-[var(--border-gray)] cursor-pointer"
                  checked={selected.includes(category)}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange(category, checked === true);
                  }}
                />
                <span className="cursor-pointer max-w-[150px] truncate">
                  {capitalizeFirstLetter(category)}
                </span>
              </div>
              <span className="text-[12px] leading-[16px] text-text-primary bg-[var(--gray-100)] rounded-sm px-1 font-medium h-5 flex items-center justify-center min-w-[20px] tracking-[1px]">
                {formatNumber(count)}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
} 