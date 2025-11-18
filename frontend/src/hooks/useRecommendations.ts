import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '../services/api';

export const usePersonalizedRecommendations = (userId: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['recommendations', userId, limit],
    queryFn: () => recommendationsApi.getPersonalized(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSimilarProducts = (productId: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['recommendations', 'similar', productId, limit],
    queryFn: () => recommendationsApi.getSimilar(productId, limit),
    enabled: !!productId,
  });
};

export const useTrendingProducts = (category?: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['recommendations', 'trending', category, limit],
    queryFn: () => recommendationsApi.getTrending(category, limit),
  });
};
