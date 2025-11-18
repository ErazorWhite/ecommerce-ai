import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { z } from 'zod';

const router = Router();

// Validation schemas
const productQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  brand: z.string().optional(),
  limit: z.string().transform(Number).default(() => 20),
  page: z.string().transform(Number).default(() => 1),
});

// GET /api/products - Get all products with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = productQuerySchema.parse(req.query);
    
    const filter: any = {};
    
    if (query.category) filter.category = query.category;
    if (query.brand) filter.brand = query.brand;
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }

    const skip = (query.page - 1) * query.limit;
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .limit(query.limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ 
      category: req.params.category 
    }).limit(20);

    res.json({ products, count: products.length });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/search - Search products
router.get('/search/query', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    }).limit(20);

    res.json({ products, count: products.length, query: q });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

export default router;
