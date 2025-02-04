'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseInfiniteScrollReturn {
  observerRef: (node: Element | null) => void;
  isLoading: boolean;
}

export function useInfiniteScroll(callback: () => Promise<void>): UseInfiniteScrollReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [target, setTarget] = useState<Element | null>(null);

  const observerRef = useCallback((node: Element | null) => {
    setTarget(node);
  }, []);

  useEffect(() => {
    if (!target) return;

    const observer = new IntersectionObserver(
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

    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, isLoading, target]);

  return { observerRef, isLoading };
} 