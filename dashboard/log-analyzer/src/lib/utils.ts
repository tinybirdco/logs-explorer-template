import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { genericCounterApi } from "@/lib/tinybird";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getTotalRowCount(params: {
  start_date?: string;
  end_date?: string;
  tenant_name?: string[];
  client_name?: string[];
  user_name?: string[];
  user_agent?: string[];
  hostname?: string[];
  description?: string[];
  connection?: string[];
  strategy?: string[];
  strategy_type?: string[];
}) {
  try {
    const response = await genericCounterApi({
      column_name: 'tenant_name',
      ...params
    });
    
    return response.data.reduce((sum, item) => sum + item.count, 0);
  } catch (error) {
    console.error('Error getting total count:', error);
    return 0;
  }
}
