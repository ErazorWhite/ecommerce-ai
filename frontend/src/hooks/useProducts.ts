import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api';

export const useProducts = (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  limit?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsApi.getByCategory(category),
    enabled: !!category,
  });
};
