import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function useDefaultDateRange() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('start_date') || !searchParams.get('end_date')) {
      const params = new URLSearchParams(searchParams.toString());
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      params.set('start_date', sevenDaysAgo.toISOString().split('.')[0].replace('T', ' ').replace('Z', ''));
      params.set('end_date', now.toISOString().split('.')[0].replace('T', ' ').replace('Z', ''));

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, router, pathname]);

  return {
    start_date: searchParams.get('start_date'),
    end_date: searchParams.get('end_date')
  };
} 