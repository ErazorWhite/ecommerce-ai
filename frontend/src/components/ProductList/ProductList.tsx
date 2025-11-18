import type { Product } from '../../types/index.js';
import { ProductCard } from '../ProductCard/ProductCard';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  title?: string;
  loading?: boolean;
}

export const ProductList = ({ products, title, loading }: ProductListProps) => {
  if (loading) {
    return (
      <div className="product-list-container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="loading">Завантаження товарів...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list-container">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="empty-state">Товари не знайдено</div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      {title && <h2 className="section-title">{title}</h2>}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => console.log('Product clicked:', product._id)}
          />
        ))}
      </div>
    </div>
  );
};
