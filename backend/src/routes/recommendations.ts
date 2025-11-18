import { Router, Request, Response } from 'express';
import { recommendationService } from '../services/recommendationService';
import { z } from 'zod';

const router = Router();

const recommendationQuerySchema = z.object({
  limit: z.string().transform(Number).default(() => 5),
  exclude: z.string().optional(),
});

// GET /api/recommendations/:userId - Personalized recommendations
router.get('/:userId', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const query = recommendationQuerySchema.parse(req.query);
    const excludeIds = query.exclude ? query.exclude.split(',') : [];

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      req.params.userId,
      query.limit,
      excludeIds
    );

    const latency = Date.now() - startTime;

    res.json({
      userId: req.params.userId,
      recommendations,
      algorithm: 'REST_collaborative_filtering',
      latency_ms: latency,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// GET /api/recommendations/similar/:productId - Similar products
router.get('/similar/:productId', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const limit = Number(req.query.limit) || 5;
    const similar = await recommendationService.getSimilarProducts(
      req.params.productId,
      limit
    );

    const latency = Date.now() - startTime;

    res.json({
      productId: req.params.productId,
      similar,
      latency_ms: latency,
      count: similar.length,
    });
  } catch (error) {
    console.error('Error getting similar products:', error);
    res.status(500).json({ error: 'Failed to get similar products' });
  }
});

// GET /api/recommendations/trending - Trending products
router.get('/trending/products', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const category = req.query.category as string | undefined;
    const limit = Number(req.query.limit) || 5;
    
    const trending = await recommendationService.getTrendingProducts(category, limit);
    const latency = Date.now() - startTime;

    res.json({
      category: category || 'all',
      trending,
      latency_ms: latency,
      count: trending.length,
    });
  } catch (error) {
    console.error('Error getting trending products:', error);
    res.status(500).json({ error: 'Failed to get trending products' });
  }
});

export default router;
