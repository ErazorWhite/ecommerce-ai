import { useState } from 'react';
import { usePersonalizedRecommendations } from '../../hooks/useRecommendations';
import { useGrpcPersonalizedRecommendations } from '../../hooks/useGrpcRecommendations';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../ProductCard/ProductCard';
import { PerformanceMetrics } from '../PerformanceMetrics/PerformanceMetrics';
import { useApiMode } from '../../contexts/ApiModeContext';
import './RecommendationSection.css';

interface RecommendationSectionProps {
  userId: string;
}

export const RecommendationSection = ({ userId }: RecommendationSectionProps) => {
  const [limit] = useState(5);
  const { mode } = useApiMode();

  // REST API
  const {
    data: restRecommendations,
    isLoading: restLoading,
    error: restError
  } = usePersonalizedRecommendations(userId, limit);

  // gRPC API
  const {
    data: grpcRecommendations,
    isLoading: grpcLoading,
    error: grpcError
  } = useGrpcPersonalizedRecommendations(userId, limit);

  // Select data based on mode
  const recommendations = mode === 'REST' ? restRecommendations : grpcRecommendations;
  const isLoading = mode === 'REST' ? restLoading : grpcLoading;
  const error = mode === 'REST' ? restError : grpcError;

  const { data: productsData } = useProducts();

  if (isLoading) {
    return (
      <div className="recommendation-section">
        <div className="section-header">
          <h2>🎯 Персональні рекомендації</h2>
          <div className="loading-badge">Генерація рекомендацій... ({mode})</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-section">
        <div className="section-header">
          <h2>🎯 Персональні рекомендації</h2>
          <div className="error-badge">Помилка завантаження ({mode})</div>
        </div>
        <div className="error-details">
          {String(error)}
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
      </div>

      <PerformanceMetrics
        clientLatency={recommendations.client_latency_ms}
        serverLatency={recommendations.server_latency_ms || recommendations.latency_ms}
        totalLatency={recommendations.total_latency_ms || recommendations.client_latency_ms}
        protocol={mode}
      />

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
              {mode === 'REST'
                ? 'REST API забезпечує швидку відповідь сервера'
                : 'gRPC (Connect-Web) використовує HTTP/2 та Protocol Buffers'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
