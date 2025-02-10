'use client';

import { genericCounterApi } from "@/lib/tinybird";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Search, X } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDefaultDateRange } from "@/hooks/useDefaultDateRange";
import { cn } from "@/lib/utils";

interface GenericCounterProps {
  columnName: string;
  title: string;
  onSelectionChange?: (selected: string[]) => void;
}

interface CountData {
  category: string;
  count: number;
}

const VISIBLE_ITEMS = 5;

export function GenericCounter({ 
  columnName, 
  title,
  onSelectionChange 
}: GenericCounterProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CountData[]>([]);
  const [filteredData, setFilteredData] = useState<CountData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const initializedRef = useRef(false);
  const currentParams = searchParams.get(columnName);
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  useDefaultDateRange();

  // Initialize selected from URL params
  useEffect(() => {
    if (currentParams && !initializedRef.current) {
      const urlParams = currentParams.split(',').filter(Boolean);
      setSelected(urlParams);
      initializedRef.current = true;
    }
  }, [currentParams]);

  // Fetch data effect
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await genericCounterApi({ 
          column_name: columnName,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        });
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [columnName, startDate, endDate]);

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
          <div className="absolute -left-3 top-0 bottom-0 w-1 height-24 bg-[#357AF6] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "text-text-primary text-[14px] leading-[17px] transition-all",
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
                <div className="bg-[#EEF4FF] text-text-primary px-2 py-0.5 rounded-l font-medium h-6 w-7 flex items-center justify-center">
                  <span className="text-[12px] leading-[16px]">{selected.length}</span>
                </div>
                <div 
                  className="bg-[#EEF4FF] text-text-primary px-1.5 py-0.5 rounded-r border-l border-white h-6 flex items-center justify-center"
                >
                  <X size={16} />
                </div>
              </div>
            )}
          </div>
          <ChevronDown className={cn(
            "h-6 w-6 transition-transform duration-200 cursor-pointer",
            !isOpen && "transform rotate-180"
          )} />
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        {showSearch && (
          <div className="relative my-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-8 border-border-gray border rounded-lg focus-visible:border-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1">
          {visibleItems.map(({ category, count }) => (
            <label
              key={category}
              className="flex items-center justify-between py-0 hover:bg-gray-50 rounded cursor-pointer"
            >
              <div className="flex items-end gap-2">
                <Checkbox
                  className="border-border-gray cursor-pointer"
                  checked={selected.includes(category)}
                  onCheckedChange={(checked) => {
                    handleCheckboxChange(category, checked === true);
                  }}
                />
                <span className="text-[14px] leading-[17px] font-normal cursor-pointer">
                  {category}
                </span>
              </div>
              <span className="text-[12px] leading-[16px] text-text-primary bg-gray-100 rounded-sm px-1 font-medium h-6 flex items-center justify-center min-w-[20px]">
                {count}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
} 