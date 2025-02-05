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

  const handleCheckboxChange = (category: string) => {
    const newSelected = selected.includes(category)
      ? selected.filter(item => item !== category)
      : [...selected, category];
    
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardHeader className="p-4">
          <div className="flex w-full items-center justify-between">
            <CollapsibleTrigger className="flex items-center space-x-2">
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`}
              />
              <CardTitle className="text-lg">{title}</CardTitle>
            </CollapsibleTrigger>
            {selected.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted relative"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent collapsible from toggling
                  handleClearSelections();
                }}
              >
                <X className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {selected.length}
                </span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            {showSearch && (
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${title.toLowerCase()}...`}
                  className="pl-8 pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7 rounded-full hover:bg-muted"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <div className="space-y-2">
              {visibleItems.map((item) => (
                <div key={item.category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${columnName}-${item.category}`}
                    checked={selected.includes(item.category)}
                    onCheckedChange={() => handleCheckboxChange(item.category)}
                  />
                  <label
                    htmlFor={`${columnName}-${item.category}`}
                    className="flex flex-1 justify-between text-sm items-center cursor-pointer"
                  >
                    <span className="font-medium">{item.category}</span>
                    <span className="text-gray-500">{item.count.toLocaleString()}</span>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
} 