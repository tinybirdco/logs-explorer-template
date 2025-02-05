'use client';

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('message', term);
    } else {
      params.delete('message');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search logs..."
        className="pl-8"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('message') ?? ''}
      />
    </div>
  );
} 