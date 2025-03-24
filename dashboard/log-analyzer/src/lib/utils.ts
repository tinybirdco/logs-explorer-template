import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createGenericCounterApi } from "@/lib/tinybird";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getTotalRowCount(params: {
  start_date?: string;
  end_date?: string;
  service?: string[];
  level?: string[];
  environment?: string[];
  request_method?: string[];
  status_code?: number[];
  request_path?: string[];
  user_agent?: string[];
}) {
  try {
    const genericCounterApi = createGenericCounterApi(process.env.NEXT_PUBLIC_TINYBIRD_API_KEY!);
    const response = await genericCounterApi({
      column_name: 'level',
      ...params
    });
    
    return response.data.reduce((sum, item) => sum + item.count, 0);
  } catch (error) {
    console.error('Error getting total count:', error);
    return 0;
  }
}
