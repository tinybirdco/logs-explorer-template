'use client';

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRefresh = () => {
    const params = new URLSearchParams(searchParams.toString());
    const now = new Date();
    
    // Update end_date to now
    params.set('end_date', now.toISOString().split('.')[0].replace('T', ' ').replace('Z', ''));
    
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