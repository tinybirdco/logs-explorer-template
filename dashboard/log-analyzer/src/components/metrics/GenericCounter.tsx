'use client';

import { genericCounterApi } from "@/lib/tinybird";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react"; // Make sure lucide-react is installed
import { useSearchParams } from 'next/navigation';

interface GenericCounterProps {
  columnName: string;
  title: string;
  onSelectionChange?: (selected: string[]) => void;
}

interface CountData {
  category: string;
  count: number;
}

export function GenericCounter({ 
  columnName, 
  title,
  onSelectionChange 
}: GenericCounterProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<CountData[]>([]);
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

  const handleCheckboxChange = (category: string) => {
    const newSelected = selected.includes(category)
      ? selected.filter(item => item !== category)
      : [...selected, category];
    
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
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
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2">
              {data.map((item) => (
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