import { DashboardConfig } from "@/config/types";

declare module "*.json" {
  const value: DashboardConfig;
  export default value;
} 