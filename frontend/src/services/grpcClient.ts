import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { RecommendationService } from '../gen/proto/recommendations_connect.js';

const GRPC_BASE_URL = import.meta.env.VITE_GRPC_URL || 'http://localhost:3000';

// Create transport for Connect-Web
const transport = createConnectTransport({
  baseUrl: `${GRPC_BASE_URL}/connect`,
});

// Create typed client
export const grpcRecommendationClient = createPromiseClient(RecommendationService, transport);

// gRPC Recommendations API
export const grpcRecommendationsApi = {
  getPersonalized: async (
    userId: string,
    limit: number = 5,
    excludeProductIds: string[] = []
  ) => {
    const startTime = performance.now();

    const response = await grpcRecommendationClient.getRecommendations({
      userId,
      limit,
      excludeProductIds,
    });

    const clientLatency = performance.now() - startTime;

    return {
      recommendations: response.recommendations.map(rec => ({
        productId: rec.productId,
        name: rec.name,
        category: rec.category,
        price: rec.price,
        score: rec.score,
        reason: rec.reason,
      })),
      algorithm: response.algorithm,
      server_latency_ms: response.latencyMs,
      client_latency_ms: clientLatency,
      total_latency_ms: clientLatency,
    };
  },

  getSimilar: async (productId: string, limit: number = 5) => {
    const startTime = performance.now();

    const response = await grpcRecommendationClient.getSimilarProducts({
      productId,
      limit,
    });

    const clientLatency = performance.now() - startTime;

    return {
      similarProducts: response.similarProducts.map(rec => ({
        productId: rec.productId,
        name: rec.name,
        category: rec.category,
        price: rec.price,
        score: rec.score,
        reason: rec.reason,
      })),
      server_latency_ms: response.latencyMs,
      client_latency_ms: clientLatency,
      total_latency_ms: clientLatency,
    };
  },

  getTrending: async (category?: string, limit: number = 5) => {
    const startTime = performance.now();

    const response = await grpcRecommendationClient.getTrendingProducts({
      category: category || '',
      limit,
    });

    const clientLatency = performance.now() - startTime;

    return {
      trendingProducts: response.trendingProducts.map(rec => ({
        productId: rec.productId,
        name: rec.name,
        category: rec.category,
        price: rec.price,
        score: rec.score,
        reason: rec.reason,
      })),
      server_latency_ms: response.latencyMs,
      client_latency_ms: clientLatency,
      total_latency_ms: clientLatency,
    };
  },
};
