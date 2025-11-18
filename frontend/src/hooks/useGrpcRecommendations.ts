import { useQuery } from '@tanstack/react-query';
import { grpcRecommendationsApi } from '../services/grpcClient';

export const useGrpcPersonalizedRecommendations = (userId: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['grpc-recommendations', userId, limit],
    queryFn: () => grpcRecommendationsApi.getPersonalized(userId, limit),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGrpcSimilarProducts = (productId: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['grpc-recommendations', 'similar', productId, limit],
    queryFn: () => grpcRecommendationsApi.getSimilar(productId, limit),
    enabled: !!productId,
  });
};

export const useGrpcTrendingProducts = (category?: string, limit: number = 5) => {
  return useQuery({
    queryKey: ['grpc-recommendations', 'trending', category, limit],
    queryFn: () => grpcRecommendationsApi.getTrending(category, limit),
  });
};
