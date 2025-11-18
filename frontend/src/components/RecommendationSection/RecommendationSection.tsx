import { useState } from 'react';
import { usePersonalizedRecommendations } from '../../hooks/useRecommendations';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../ProductCard/ProductCard';
import './RecommendationSection.css';

interface RecommendationSectionProps {
  userId: string;
}

export const RecommendationSection = ({ userId }: RecommendationSectionProps) => {
  const [limit] = useState(5);
  const { data: recommendations, isLoading, error } = usePersonalizedRecommendations(userId, limit);
  const { data: productsData } = useProducts();

  if (isLoading) {
    return (
      <div className="recommendation-section">
        <div className="section-header">
          <h2>🎯 Персональні рекомендації</h2>
          <div className="loading-badge">Генерація рекомендацій...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-section">
        <div className="section-header">
          <h2>🎯 Персональні рекомендації</h2>
          <div className="error-badge">Помилка завантаження</div>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className="recommendation-section">
        <div className="section-header">
          <h2>🎯 Персональні рекомендації</h2>
        </div>
        <div className="empty-recommendations">
          Немає рекомендацій для цього користувача
        </div>
      </div>
    );
  }

  const recommendedProducts = recommendations.recommendations.map(rec => {
    const product = productsData?.products.find(p => p._id === rec.productId);
    return { rec, product };
  }).filter(item => item.product);

  return (
    <div className="recommendation-section">
      <div className="section-header">
        <h2>🎯 Персональні рекомендації для вас</h2>
        <div className="recommendation-meta">
          <span className="algorithm-badge">
            Алгоритм: {recommendations.algorithm}
          </span>
          <span className="latency-badge">
            ⚡ {recommendations.latency_ms.toFixed(2)}ms
          </span>
        </div>
      </div>

      <div className="recommendations-grid">
        {recommendedProducts.map(({ rec, product }) => (
          product && (
            <ProductCard
              key={rec.productId}
              product={product}
              showReason={true}
              reason={rec.reason}
            />
          )
        ))}
      </div>

      <div className="recommendation-info">
        <div className="info-card">
          <div className="info-icon">🤖</div>
          <div className="info-content">
            <div className="info-title">Машинне навчання</div>
            <div className="info-text">
              Рекомендації базуються на вашій історії переглядів та покупок
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">⚡</div>
          <div className="info-content">
            <div className="info-title">Швидкість</div>
            <div className="info-text">
              REST API забезпечує швидку відповідь сервера
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
