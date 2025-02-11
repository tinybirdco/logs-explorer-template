'use client';

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('message') ?? '');

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('message', term);
    } else {
      params.delete('message');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClear = () => {
    setSearchTerm('');
    handleSearch('');
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
      <Input
        placeholder="Search logs..."
        className="h-10 pl-9 pr-9 border-[var(--border-gray)]"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {searchTerm && (
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