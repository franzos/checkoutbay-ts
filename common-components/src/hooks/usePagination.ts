import { useState, useCallback, useEffect } from 'react';

export interface PaginationConfig {
  total: number;
  initial: number;
  perPage: number;
}

export interface PaginationParams {
  nextPage: number;
  [key: string]: any;
}

export interface UsePaginationOptions<T> {
  perPage?: number;
  initialPage?: number;
  fetchData: (params: PaginationParams) => Promise<{ data: T[]; total: number }>;
  additionalParams?: Record<string, any>;
}

export interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  perPage: number;
  paginationConfig: PaginationConfig;
  refetch: () => void;
  setPage: (page: number) => Promise<T[]>;
  setAdditionalParams: (params: Record<string, any>) => void;
  loadPage: (page: number, params?: Record<string, any>) => Promise<T[]>;
}

export function usePagination<T>({
  perPage = 10,
  initialPage = 1,
  fetchData,
  additionalParams = {},
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [currentAdditionalParams, setCurrentAdditionalParams] = useState(additionalParams);

  const loadData = useCallback(async (targetPage: number, params: Record<string, any> = {}): Promise<T[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData({
        nextPage: targetPage,
        ...currentAdditionalParams,
        ...params,
      });
      
      setData(result.data);
      setTotal(result.total);
      setPage(targetPage);
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([]);
      setTotal(0);
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchData, currentAdditionalParams]);

  const refetch = useCallback(() => {
    loadData(page);
  }, [loadData, page]);

  const handleSetPage = useCallback(async (newPage: number): Promise<T[]> => {
    return loadData(newPage);
  }, [loadData]);

  const setAdditionalParams = useCallback((params: Record<string, any>) => {
    setCurrentAdditionalParams(params);
    loadData(1, params);
  }, [loadData]);

  const loadPage = useCallback(async (targetPage: number, params: Record<string, any> = {}): Promise<T[]> => {
    return loadData(targetPage, params);
  }, [loadData]);

  // Initial load only
  useEffect(() => {
    loadData(initialPage);
  }, []);

  const paginationConfig: PaginationConfig = {
    total,
    initial: initialPage,
    perPage,
  };

  return {
    data,
    loading,
    error,
    total,
    page,
    perPage,
    paginationConfig,
    refetch,
    setPage: handleSetPage,
    setAdditionalParams,
    loadPage,
  };
}