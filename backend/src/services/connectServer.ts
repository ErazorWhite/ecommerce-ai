import type { ConnectRouter } from '@connectrpc/connect';
import { RecommendationService } from '../gen/src/proto/recommendations_connect.js';
import { recommendationService } from './recommendationService.js';

export default (router: ConnectRouter) =>
  router.service(RecommendationService, {
    /**
     * Get personalized recommendations for a user
     */
    async getRecommendations(req) {
      const startTime = Date.now();
      const { userId, limit = 5, excludeProductIds = [] } = req;

      try {
        console.log(`📡 Connect: GetRecommendations for user ${userId}`);

        const recommendations = await recommendationService.getPersonalizedRecommendations(
          userId,
          limit,
          excludeProductIds
        );

        const latencyMs = Date.now() - startTime;

        return {
          recommendations: recommendations.map((r) => ({
            productId: r.productId,
            name: r.name,
            category: r.category,
            price: r.price,
            score: r.score,
            reason: r.reason,
          })),
          algorithm: 'collaborative_filtering_hybrid',
          latencyMs,
        };
      } catch (error: any) {
        console.error('Connect Error:', error);
        throw error;
      }
    },

    /**
     * Get similar products based on a product ID
     */
    async getSimilarProducts(req) {
      const startTime = Date.now();
      const { productId, limit = 5 } = req;

      try {
        console.log(`📡 Connect: GetSimilarProducts for ${productId}`);

        const similar = await recommendationService.getSimilarProducts(productId, limit);
        const latencyMs = Date.now() - startTime;

        return {
          similarProducts: similar.map((r) => ({
            productId: r.productId,
            name: r.name,
            category: r.category,
            price: r.price,
            score: r.score,
            reason: r.reason,
          })),
          latencyMs,
        };
      } catch (error: any) {
        console.error('Connect Error:', error);
        throw error;
      }
    },

    /**
     * Get trending products in a category
     */
    async getTrendingProducts(req) {
      const startTime = Date.now();
      const { category, limit = 5 } = req;

      try {
        console.log(`📡 Connect: GetTrendingProducts in ${category || 'all categories'}`);

        const trending = await recommendationService.getTrendingProducts(category || undefined, limit);
        const latencyMs = Date.now() - startTime;

        return {
          trendingProducts: trending.map((r) => ({
            productId: r.productId,
            name: r.name,
            category: r.category,
            price: r.price,
            score: r.score,
            reason: r.reason,
          })),
          latencyMs,
        };
      } catch (error: any) {
        console.error('Connect Error:', error);
        throw error;
      }
    },
  });
