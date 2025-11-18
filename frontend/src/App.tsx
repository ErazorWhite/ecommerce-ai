import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header/Header';
import { RecommendationSection } from './components/RecommendationSection/RecommendationSection';
import { ProductList } from './components/ProductList/ProductList';
import { useProducts } from './hooks/useProducts';
import { useUsers } from './hooks/useUsers';
import { getCategoryLabel } from './utils/format';
import type { Category } from './types/index.js';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const { data: usersData } = useUsers();
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  useEffect(() => {
    if (usersData?.users && usersData.users.length > 0 && !selectedUserId) {
      setSelectedUserId(usersData.users[0]._id);
    }
  }, [usersData, selectedUserId]);

  const categories: Array<Category | 'all'> = [
    'all',
    'smartphones',
    'laptops',
    'audio',
    'gaming',
    'accessories',
  ];

  return (
    <div className="app">
      <Header selectedUserId={selectedUserId} onUserChange={setSelectedUserId} />

      <main className="main-content">
        <div className="container">
          {selectedUserId && (
            <RecommendationSection userId={selectedUserId} />
          )}

          <div className="category-filter">
            <h3>Категорії товарів</h3>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Всі товари' : getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          <ProductList
            products={productsData?.products || []}
            title={
              selectedCategory === 'all'
                ? 'Всі товари'
                : getCategoryLabel(selectedCategory)
            }
            loading={productsLoading}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2025 E-Commerce AI | Магістерська робота | Node.js + React + ML</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
