// Custom hooks for API operations
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { User, Product, Order } from '../types';

// Generic hook for API operations
export function useApiData<T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Specific hooks for each entity
export function useUsers() {
  return useApiData(() => apiService.getUsers());
}

export function useProducts() {
  return useApiData(() => apiService.getProducts());
}

export function useOrders() {
  return useApiData(() => apiService.getOrders());
}

export function useDashboardStats() {
  return useApiData(() => apiService.getDashboardStats());
}

// CRUD operations hooks
export function useCrud<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <R>(operation: () => Promise<R>): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}