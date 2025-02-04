'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSectionProps {
  title: string;
  items: Array<{
    label: string;
    count: number;
  }>;
}

export default function FilterSection({ title, items }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Checkbox id={item.label} />
              <label
                htmlFor={item.label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </label>
            </div>
            <span className="text-xs text-muted-foreground">{item.count}</span>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}