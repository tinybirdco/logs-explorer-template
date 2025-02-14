'use client';

import { useState, useCallback } from 'react';

interface UseInfiniteScrollReturn {
  observerRef: (node: Element | null) => void;
  isLoading: boolean;
}

export function useInfiniteScroll(callback: () => Promise<void>): UseInfiniteScrollReturn {
  const [isLoading, setIsLoading] = useState(false);
  const observer = useCallback(
    (node: Element | null) => {
      if (node) {
        const intersectionObserver = new IntersectionObserver(
          async (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !isLoading) {
              setIsLoading(true);
              await callback();
              setIsLoading(false);
            }
          },
          {
            rootMargin: '100px',
          }
        );

        intersectionObserver.observe(node);
        return () => intersectionObserver.disconnect();
      }
    },
    [callback, isLoading]
  );

  return { observerRef: observer, isLoading };
} 