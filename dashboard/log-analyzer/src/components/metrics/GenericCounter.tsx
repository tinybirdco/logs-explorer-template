'use client';

import { genericCounterApi } from "@/lib/tinybird";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, Search, X } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";
import { cn } from "@/lib/utils";

interface GenericCounterProps {
  columnName: string;
  title: string;
  onSelectionChange?: (selected: string[]) => void;
  shouldRefresh: boolean;
}

interface CountData {
  category: string;
  count: number;
}

const VISIBLE_ITEMS = 5;

const dataCache: Record<string, CountData[]> = {};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('de-DE').format(num);
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function GenericCounter({ 
  columnName, 
  title,
  onSelectionChange,
  shouldRefresh
}: GenericCounterProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CountData[]>(dataCache[columnName] || []);
  const [filteredData, setFilteredData] = useState<CountData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!dataCache[columnName]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const initializedRef = useRef(false);
  const currentParams = searchParams.get(columnName);
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const hasInitializedRef = useRef(false);

  useDefaultDateRange();

  // Initialize selected from URL params
  useEffect(() => {
    if (currentParams && !initializedRef.current) {
      const urlParams = currentParams.split(',').filter(Boolean);
      setSelected(urlParams);
      initializedRef.current = true;
    }
  }, [currentParams]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await genericCounterApi({ 
        column_name: columnName,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      dataCache[columnName] = response.data || [];
      setData(dataCache[columnName]);
      setFilteredData(dataCache[columnName]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  // Only fetch on first mount
  useEffect(() => {
    if (!hasInitializedRef.current && !dataCache[columnName]) {
      hasInitializedRef.current = true;
      fetchData();
    } else {
      setIsLoading(false); // Ensure loading is false if using cached data
    }
  }, []);

  // Handle refresh
  useEffect(() => {
    if (shouldRefresh) {
      fetchData();
    }
  }, [shouldRefresh]);

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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
            <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
            <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
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
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--search-icon)]" />
            <Input
              placeholder="Search"
              className="pl-8 border-[var(--border-gray)] border rounded-lg focus-visible:border-1"
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