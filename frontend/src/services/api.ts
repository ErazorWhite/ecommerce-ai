import axios from 'axios';
import type { Product, ProductsResponse, RecommendationResponse, User } from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsApi = {
  getAll: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    limit?: number;
    page?: number;
  }): Promise<ProductsResponse> => {
    const { data } = await api.get('/api/products', { params });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/api/products/${id}`);
    return data;
  },

  getByCategory: async (category: string): Promise<{ products: Product[]; count: number }> => {
    const { data } = await api.get(`/api/products/category/${category}`);
    return data;
  },

  search: async (query: string): Promise<{ products: Product[]; count: number }> => {
    const { data } = await api.get('/api/products/search/query', { params: { q: query } });
    return data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<{ users: User[]; count: number }> => {
    const { data } = await api.get('/api/users');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
  },
};

// Recommendations API (REST)
export const recommendationsApi = {
  getPersonalized: async (
    userId: string,
    limit: number = 5
  ): Promise<RecommendationResponse> => {
    const startTime = performance.now();
    const { data } = await api.get(`/api/recommendations/${userId}`, { params: { limit } });
    const clientLatency = performance.now() - startTime;
    
    return {
      ...data,
      client_latency_ms: clientLatency,
    };
  },

  getSimilar: async (productId: string, limit: number = 5) => {
    const { data } = await api.get(`/api/recommendations/similar/${productId}`, {
      params: { limit },
    });
    return data;
  },

  getTrending: async (category?: string, limit: number = 5) => {
    const { data } = await api.get('/api/recommendations/trending/products', {
      params: { category, limit },
    });
    return data;
  },
};

// Interactions API
export const interactionsApi = {
  track: async (interaction: {
    userId: string;
    productId?: string;
    type: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'search';
    sessionId: string;
    metadata?: Record<string, any>;
  }) => {
    const { data } = await api.post('/api/interactions', interaction);
    return data;
  },

  getUserInteractions: async (userId: string, limit: number = 50) => {
    const { data } = await api.get(`/api/interactions/user/${userId}`, { params: { limit } });
    return data;
  },
};

export default api;
