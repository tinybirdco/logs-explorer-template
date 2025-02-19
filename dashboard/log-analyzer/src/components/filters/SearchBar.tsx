'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getTotalRowCount } from "@/lib/utils";
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const checkRowCount = async () => {
      const params = {
        start_date: searchParams.get('start_date') || undefined,
        end_date: searchParams.get('end_date') || undefined,
        service: searchParams.get('service')?.split(',').filter(Boolean) || undefined,
        level: searchParams.get('level')?.split(',').filter(Boolean) || undefined,
        environment: searchParams.get('environment')?.split(',').filter(Boolean) || undefined,
        request_method: searchParams.get('request_method')?.split(',').filter(Boolean) || undefined,
        status_code: searchParams.get('status_code')?.split(',').filter(Boolean)?.map(Number) || undefined,
        request_path: searchParams.get('request_path')?.split(',').filter(Boolean) || undefined,
        user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean) || undefined,
      };

      const totalCount = await getTotalRowCount(params);
      const newIsDisabled = totalCount >= 100_000_000;
      setIsDisabled(newIsDisabled);
      
      if (newIsDisabled) {
        setInputValue('');
        handleSearch('');
      }
    };

    checkRowCount();
    setInputValue(searchParams.get('message') ?? '');
  }, [searchParams]);

  const handleSearch = (term: string) => {
    if (isDisabled) return;
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('message', term);
    } else {
      params.delete('message');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    if (isDisabled) return;
    setInputValue('');
    handleSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--button-text)]" />
            <Input
              placeholder={isDisabled ? "Narrow the filters to enable search" : "Search... "}
              className="h-10 pl-9 pr-9 border-[var(--border-gray)] font-semibold"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full hover:bg-muted"
                onClick={handleClear}
                disabled={isDisabled}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" className="mt-2"> 
          {isDisabled ? (
            <p>Filter by Environment and Service and one day of data.
            </p>
          ) : (
            <p>Search the Message column: Memory|Timeout</p>
          )}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
} 