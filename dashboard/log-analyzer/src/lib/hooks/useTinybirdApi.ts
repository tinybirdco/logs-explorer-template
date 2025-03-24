import { useMemo } from 'react';
import { useTinybirdToken } from '@/app/providers/TinybirdProvider';
import { createLogAnalysisApi, createLogExplorerApi, createGenericCounterApi } from '../tinybird';

export function useTinybirdApi() {
  const { token } = useTinybirdToken();

  const apis = useMemo(() => ({
    logAnalysisApi: createLogAnalysisApi(token),
    logExplorerApi: createLogExplorerApi(token),
    genericCounterApi: createGenericCounterApi(token),
  }), [token]);

  return apis;
} 