export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    smartphones: 'Смартфони',
    laptops: 'Ноутбуки',
    tablets: 'Планшети',
    accessories: 'Аксесуари',
    audio: 'Аудіо',
    gaming: 'Ігрові консолі',
  };
  return labels[category] || category;
};
