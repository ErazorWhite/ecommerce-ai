import { Product, IProduct } from '../models/Product';
import { User } from '../models/User';
import { Interaction, InteractionType } from '../models/Interaction';
import mongoose from 'mongoose';

export interface RecommendationResult {
  productId: string;
  name: string;
  category: string;
  price: number;
  score: number;
  reason: string;
}

export class RecommendationService {
  /**
   * Получить персонализированные рекомендации для пользователя
   */
  async getPersonalizedRecommendations(
    userId: string,
    limit: number = 5,
    excludeProductIds: string[] = []
  ): Promise<RecommendationResult[]> {
    const startTime = Date.now();

    try {
      // 1. Получаем историю взаимодействий пользователя
      const userInteractions = await Interaction.find({
        userId: new mongoose.Types.ObjectId(userId),
        type: { $in: [InteractionType.VIEW, InteractionType.PURCHASE, InteractionType.CLICK] },
      })
        .sort({ timestamp: -1 })
        .limit(20)
        .populate('productId');

      // 2. Получаем предпочтения пользователя
      const user = await User.findById(userId);

      // 3. Извлекаем категории и бренды из истории
      const viewedProducts = userInteractions
        .filter(i => i.productId)
        .map(i => i.productId as any as IProduct);

      const preferredCategories = [...new Set(viewedProducts.map(p => p.category))];
      const preferredBrands = [...new Set(viewedProducts.map(p => p.brand))];

      // 4. Формируем запрос для рекомендаций
      const query: any = {
        _id: { $nin: [...excludeProductIds, ...viewedProducts.map(p => p._id.toString())] },
      };

      // Фильтр по предпочтениям пользователя
      if (user?.preferences?.categories && user.preferences.categories.length > 0) {
        query.category = { $in: user.preferences.categories };
      } else if (preferredCategories.length > 0) {
        query.category = { $in: preferredCategories };
      }

      // 5. Получаем кандидатов
      const candidates = await Product.find(query).limit(limit * 3);

      // 6. Скоринг кандидатов
      const scored = candidates.map(product => {
        let score = 0;
        let reason = '';

        // Бонус за соответствие категории
        if (preferredCategories.includes(product.category)) {
          score += 0.3;
          reason = `Matches your interest in ${product.category}`;
        }

        // Бонус за бренд
        if (preferredBrands.includes(product.brand)) {
          score += 0.2;
          reason += reason ? ` and ${product.brand} products` : `You've viewed ${product.brand} before`;
        }

        // Бонус за рейтинг
        score += (product.rating / 5) * 0.3;

        // Бонус за популярность
        score += Math.min(product.reviewCount / 1000, 1) * 0.2;

        // Случайный фактор для разнообразия
        score += Math.random() * 0.1;

        return {
          productId: product._id.toString(),
          name: product.name,
          category: product.category,
          price: product.price,
          score,
          reason: reason || 'Popular in electronics',
        };
      });

      // 7. Сортируем и возвращаем топ
      const recommendations = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      const latency = Date.now() - startTime;
      console.log(`✅ Generated ${recommendations.length} recommendations in ${latency}ms`);

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(limit, excludeProductIds);
    }
  }

  /**
   * Получить похожие товары на основе характеристик
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 5
  ): Promise<RecommendationResult[]> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Находим похожие по категории и ценовому диапазону
      const priceRange = product.price * 0.3; // ±30% от цены
      
      const similar = await Product.find({
        _id: { $ne: productId },
        category: product.category,
        price: {
          $gte: product.price - priceRange,
          $lte: product.price + priceRange,
        },
      }).limit(limit);

      return similar.map(p => ({
        productId: p._id.toString(),
        name: p.name,
        category: p.category,
        price: p.price,
        score: 0.8,
        reason: `Similar to ${product.name}`,
      }));
    } catch (error) {
      console.error('Error getting similar products:', error);
      return [];
    }
  }

  /**
   * Получить популярные товары в категории
   */
  async getTrendingProducts(
    category?: string,
    limit: number = 5
  ): Promise<RecommendationResult[]> {
    try {
      const query: any = category ? { category } : {};
      
      const trending = await Product.find(query)
        .sort({ reviewCount: -1, rating: -1 })
        .limit(limit);

      return trending.map(p => ({
        productId: p._id.toString(),
        name: p.name,
        category: p.category,
        price: p.price,
        score: p.rating / 5,
        reason: `Trending in ${p.category}`,
      }));
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  }

  /**
   * Fallback рекомендации (популярные товары)
   */
  private async getFallbackRecommendations(
    limit: number,
    excludeProductIds: string[]
  ): Promise<RecommendationResult[]> {
    const products = await Product.find({
      _id: { $nin: excludeProductIds },
    })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit);

    return products.map(p => ({
      productId: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
      score: 0.5,
      reason: 'Popular choice',
    }));
  }
}

export const recommendationService = new RecommendationService();
