'use client';

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRefresh = () => {
    // Dispatch custom event for refresh
    window.dispatchEvent(new Event('refresh-filters'));
    
    // Update URL params as before
    const params = new URLSearchParams(searchParams.toString());
    const now = new Date();
    params.set('end_date', now.toISOString().split('.')[0].replace('T', ' '));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={handleRefresh}
      className="btn-icon"
    >
      <RotateCw className="h-4 w-4" />
    </Button>
  );
} 