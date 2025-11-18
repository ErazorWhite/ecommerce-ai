import { Router, Request, Response } from 'express';
import { Interaction, InteractionType } from '../models/Interaction';
import { z } from 'zod';

const router = Router();

const createInteractionSchema = z.object({
  userId: z.string(),
  productId: z.string().optional(),
  type: z.enum(['view', 'click', 'add_to_cart', 'purchase', 'search']),
  metadata: z.record(z.any()).optional(),
  sessionId: z.string(),
});

// POST /api/interactions - Track new interaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createInteractionSchema.parse(req.body);
    const interaction = await Interaction.create({
      ...validatedData,
      timestamp: new Date(),
    });
    
    res.status(201).json(interaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    console.error('Error creating interaction:', error);
    res.status(500).json({ error: 'Failed to track interaction' });
  }
});

// GET /api/interactions/user/:userId - Get user interactions
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { limit = '50' } = req.query;
    
    const interactions = await Interaction.find({ 
      userId: req.params.userId 
    })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .populate('productId');

    res.json({ interactions, count: interactions.length });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// GET /api/interactions/product/:productId - Get product interactions
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const interactions = await Interaction.find({ 
      productId: req.params.productId 
    }).sort({ timestamp: -1 });

    // Агрегация по типам
    const stats = await Interaction.aggregate([
      { $match: { productId: req.params.productId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    res.json({ 
      interactions, 
      total: interactions.length,
      stats: stats.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    console.error('Error fetching product interactions:', error);
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

// GET /api/interactions/analytics - Get analytics summary
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const stats = await Interaction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const totalInteractions = await Interaction.countDocuments();

    res.json({
      total: totalInteractions,
      byType: stats.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {} as Record<string, number>)
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
