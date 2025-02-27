'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getTotalRowCount } from "@/lib/utils";
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
        tenant_name: searchParams.get('tenant_name')?.split(',').filter(Boolean) || undefined,
        client_name: searchParams.get('client_name')?.split(',').filter(Boolean) || undefined,
        user_name: searchParams.get('user_name')?.split(',').filter(Boolean) || undefined,
        user_agent: searchParams.get('user_agent')?.split(',').filter(Boolean) || undefined,
        hostname: searchParams.get('hostname')?.split(',').filter(Boolean) || undefined,
        description: searchParams.get('description')?.split(',').filter(Boolean) || undefined,
        connection: searchParams.get('connection')?.split(',').filter(Boolean) || undefined,
        strategy: searchParams.get('strategy')?.split(',').filter(Boolean) || undefined,
        strategy_type: searchParams.get('strategy_type')?.split(',').filter(Boolean) || undefined,
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
      params.set('description', term);
    } else {
      params.delete('description');
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
              className={cn(
                "h-10 pl-9 pr-9 border-[var(--border-gray)] font-semibold disabled:opacity-100",
                isDisabled && "placeholder:italic placeholder:text-[#8A8A8A]"
              )}
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
            <p>Filter by Tenant Name and Client Name and one day of data.</p>
          ) : (
            <p>Type to search in the Description column</p>
          )}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
} 