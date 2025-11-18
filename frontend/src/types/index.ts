export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  brand: string;
  specs: Record<string, any>;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  preferences: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export interface Recommendation {
  productId: string;
  name: string;
  category: string;
  price: number;
  score: number;
  reason: string;
}

export interface RecommendationResponse {
  userId?: string;
  recommendations: Recommendation[];
  algorithm: string;
  latency_ms: number;
  count: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type Category = 'smartphones' | 'laptops' | 'tablets' | 'accessories' | 'audio' | 'gaming';

// Add runtime value so file is not empty
export const CATEGORIES: Category[] = ['smartphones', 'laptops', 'tablets', 'accessories', 'audio', 'gaming'];
