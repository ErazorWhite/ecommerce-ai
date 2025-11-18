import type { Product } from '../../types/index.js';
import { formatPrice, formatRating } from '../../utils/format';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showReason?: boolean;
  reason?: string;
}

export const ProductCard = ({ product, onClick, showReason, reason }: ProductCardProps) => {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        <div className="placeholder-image">
          {product.category === 'smartphones' && '📱'}
          {product.category === 'laptops' && '💻'}
          {product.category === 'audio' && '🎧'}
          {product.category === 'gaming' && '🎮'}
          {product.category === 'accessories' && '🔌'}
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
          <span className="rating-value">{formatRating(product.rating)}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>

        {showReason && reason && (
          <div className="recommendation-reason">
            💡 {reason}
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `В наявності: ${product.stock}` : 'Немає в наявності'}
          </div>
        </div>
      </div>
    </div>
  );
};
