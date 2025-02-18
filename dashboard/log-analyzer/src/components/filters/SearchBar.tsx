'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(searchParams.get('message') ?? '');
  }, [searchParams]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('message', term);
    } else {
      params.delete('message');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setInputValue('');
    handleSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(inputValue);
    }
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--button-text)]" />
      <Input
        placeholder="Search logs..."
        className="h-10 pl-9 pr-9 border-[var(--border-gray)]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1.5 top-1.5 h-7 w-7 rounded-full hover:bg-muted"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 